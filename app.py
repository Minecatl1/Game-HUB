from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/music-popup')
def music_popup():
    return render_template('music-popup.html')

if __name__ == '__main__':
    app.run(debug=True)
