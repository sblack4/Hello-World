"""
This script runs the DataApi application using a development server.
"""

from os import environ
from DataApi.dataApi import app, api 

if __name__ == '__main__':
    HOST = environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(environ.get('SERVER_PORT', '8000'))
    except ValueError:
        PORT = 8000
    app.run(HOST, PORT)
