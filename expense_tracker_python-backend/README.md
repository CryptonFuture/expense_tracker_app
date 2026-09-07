# Python Flask Backend (Optional)

Alternative backend using Flask + PyMongo.

```bash
pip install -r requirements.txt
cp ../backend/.env.example .env   # or create your own
python app.py
```

Runs on port 5001. Point frontend `VITE_API_URL` to `http://localhost:5001/api` if using this instead of Node backend.
