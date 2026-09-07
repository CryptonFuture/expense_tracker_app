"""
Optional Python Flask + MongoDB backend for Expense Tracker.
Run: pip install -r requirements.txt && python app.py
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import bcrypt
import jwt
import os
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

app = Flask(__name__)
CORS(app)

MONGODB_URI = os.getenv('MONGODB_URI')
JWT_SECRET = os.getenv('JWT_SECRET', 'fallback_secret')
client = MongoClient(MONGODB_URI)
db = client['expense-tracker']
users = db['users']
expenses = db['expenses']
categories = db['categories']

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth = request.headers['Authorization']
            if auth.startswith('Bearer '):
                token = auth.split(' ')[1]
        if not token:
            return jsonify({'success': False, 'message': 'Token missing'}), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_user = users.find_one({'_id': ObjectId(data['id'])})
            if not current_user:
                return jsonify({'success': False, 'message': 'User not found'}), 401
            request.user = current_user
        except Exception:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated

def serialize(doc):
    if doc is None:
        return None
    doc['id'] = str(doc.pop('_id'))
    if 'password' in doc:
        del doc['password']
    return doc

@app.route('/')
def health():
    return jsonify({'status': 'OK', 'message': 'Python Flask API running'})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not all([name, email, password]):
        return jsonify({'success': False, 'message': 'All fields required'}), 400
    if users.find_one({'email': email}):
        return jsonify({'success': False, 'message': 'User already exists'}), 400
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    result = users.insert_one({
        'name': name,
        'email': email.lower(),
        'password': hashed,
        'createdAt': datetime.utcnow(),
    })
    token = jwt.encode({'id': str(result.inserted_id)}, JWT_SECRET, algorithm='HS256')
    return jsonify({
        'success': True,
        'token': token,
        'user': {'id': str(result.inserted_id), 'name': name, 'email': email},
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email')
    password = data.get('password')
    user = users.find_one({'email': email.lower() if email else ''})
    if not user or not bcrypt.checkpw(password.encode(), user['password']):
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    token = jwt.encode({'id': str(user['_id'])}, JWT_SECRET, algorithm='HS256')
    return jsonify({
        'success': True,
        'token': token,
        'user': {'id': str(user['_id']), 'name': user['name'], 'email': user['email']},
    })

@app.route('/api/auth/me')
@token_required
def me():
    return jsonify({'success': True, 'user': serialize(request.user)})

@app.route('/api/expenses', methods=['GET'])
@token_required
def get_expenses():
    query = {'user': request.user['_id']}
    if request.args.get('type'):
        query['type'] = request.args['type']
    if request.args.get('category'):
        query['category'] = request.args['category']
    cursor = expenses.find(query).sort('date', -1).limit(50)
    data = [serialize(e) for e in cursor]
    return jsonify({'success': True, 'count': len(data), 'data': data})

@app.route('/api/expenses', methods=['POST'])
@token_required
def create_expense():
    data = request.json or {}
    if not data.get('title') or data.get('amount') is None or not data.get('category'):
        return jsonify({'success': False, 'message': 'Title, amount, category required'}), 400
    doc = {
        'user': request.user['_id'],
        'title': data['title'],
        'amount': float(data['amount']),
        'category': data['category'],
        'type': data.get('type', 'expense'),
        'date': datetime.fromisoformat(data['date']) if data.get('date') else datetime.utcnow(),
        'description': data.get('description', ''),
        'createdAt': datetime.utcnow(),
    }
    result = expenses.insert_one(doc)
    doc['_id'] = result.inserted_id
    return jsonify({'success': True, 'data': serialize(doc)}), 201

@app.route('/api/expenses/<eid>', methods=['PUT'])
@token_required
def update_expense(eid):
    data = request.json or {}
    result = expenses.update_one(
        {'_id': ObjectId(eid), 'user': request.user['_id']},
        {'$set': {k: v for k, v in data.items() if k in ['title', 'amount', 'category', 'type', 'date', 'description']}}
    )
    if result.matched_count == 0:
        return jsonify({'success': False, 'message': 'Not found'}), 404
    exp = expenses.find_one({'_id': ObjectId(eid)})
    return jsonify({'success': True, 'data': serialize(exp)})

@app.route('/api/expenses/<eid>', methods=['DELETE'])
@token_required
def delete_expense(eid):
    result = expenses.delete_one({'_id': ObjectId(eid), 'user': request.user['_id']})
    if result.deleted_count == 0:
        return jsonify({'success': False, 'message': 'Not found'}), 404
    return jsonify({'success': True, 'message': 'Deleted'})

@app.route('/api/expenses/stats')
@token_required
def stats():
    pipeline = [
        {'$match': {'user': request.user['_id']}},
        {'$group': {'_id': '$type', 'total': {'$sum': '$amount'}}},
    ]
    results = list(expenses.aggregate(pipeline))
    income = next((r['total'] for r in results if r['_id'] == 'income'), 0)
    expense = next((r['total'] for r in results if r['_id'] == 'expense'), 0)
    by_cat = list(expenses.aggregate([
        {'$match': {'user': request.user['_id'], 'type': 'expense'}},
        {'$group': {'_id': '$category', 'total': {'$sum': '$amount'}}},
        {'$sort': {'total': -1}},
    ]))
    return jsonify({
        'success': True,
        'data': {'income': income, 'expense': expense, 'balance': income - expense, 'byCategory': by_cat},
    })

@app.route('/api/categories')
@token_required
def get_categories():
    cats = list(categories.find())
    if not cats:
        defaults = [
            {'name': 'Food & Dining', 'type': 'expense', 'icon': '🍔', 'color': '#ef4444'},
            {'name': 'Transportation', 'type': 'expense', 'icon': '🚗', 'color': '#f97316'},
            {'name': 'Shopping', 'type': 'expense', 'icon': '🛍️', 'color': '#eab308'},
            {'name': 'Salary', 'type': 'income', 'icon': '💰', 'color': '#10b981'},
            {'name': 'Other', 'type': 'both', 'icon': '📁', 'color': '#64748b'},
        ]
        categories.insert_many(defaults)
        cats = list(categories.find())
    return jsonify({'success': True, 'data': [serialize(c) for c in cats]})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
