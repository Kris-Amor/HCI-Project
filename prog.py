from flask import Flask, render_template_string

app = Flask(__name__)

@app.route('/')
def landing_page():
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Game Landing Page</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(to bottom, #1a1a2e, #16213e);
                color: white;
            }
            header {
                text-align: center;
                padding: 2rem;
                background-color: #0f3460;
            }
            header h1 {
                font-size: 3rem;
                margin: 0;
            }
            header p {
                font-size: 1.2rem;
                margin-top: 0.5rem;
            }
            .content {
                text-align: center;
                margin: 2rem auto;
                max-width: 800px;
            }
            .content img {
                width: 100%;
                max-width: 600px;
                border-radius: 10px;
            }
            .cta {
                margin-top: 2rem;
            }
            .cta button {
                background-color: #e94560;
                color: white;
                border: none;
                padding: 0.8rem 2rem;
                font-size: 1rem;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .cta button:hover {
                background-color: #ff5673;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>Welcome to Galaxy Quest!</h1>
            <p>Embark on an epic space adventure and conquer the galaxy!</p>
        </header>
        <div class="content">
            <img src="https://via.placeholder.com/600x300" alt="Game Screenshot">
            <p>Get ready to explore mysterious planets, battle alien invaders, and build your own fleet of spaceships.</p>
            <div class="cta">
                <button id="playButton">Play Now</button>
            </div>
        </div>
        <script>
            document.getElementById('playButton').addEventListener('click', function() {
                alert('Get ready to play!');
            });
        </script>
    </body>
    </html>
    """
    return render_template_string(html)

if __name__ == '__main__':
    app.run(debug=True)