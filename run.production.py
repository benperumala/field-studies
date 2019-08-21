from app import app

app.config["DEBUG"] = False
app.run(debug=False, port=8000)
