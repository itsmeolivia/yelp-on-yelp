from flask import Flask, send_file, jsonify, request
import yelp
import os

app = Flask(__name__, static_folder='static', static_url_path='')

@app.route("/")
def index():
    return send_file("static/index.html")

@app.route("/yelpmeup")
def search():
    term = request.args.get("term", "", type=str)
    location = request.args.get("location", "", type=str)

    return jsonify(**yelp.search(term, location))

if __name__ == "__main__":
    app.run(debug=True)
