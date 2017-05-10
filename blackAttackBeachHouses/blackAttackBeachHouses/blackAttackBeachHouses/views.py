"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template
from blackAttackBeachHouses import app

@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        title='Black Star Corp.',
        year=datetime.now().year,
    )

@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Dont contact us.'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='We are a cat that has a family.'
    )


#@app.route('/aWish')
#def aWish():
#    """Renders the about page."""
#    return render_template(
#        'aWish.html',
#        title='A Wish upon A Steven',
#        year=datetime.now().year,
#        message='Which house is this? .'
#    )

#@app.route('/bayStar')
#def bayStar():
#    """Renders the about page."""
#    return render_template(
#        'bayStar.html',
#        title='A Bay Star',
#        year=datetime.now().year,
#        message='This house is pretty cool.'
#    )

#@app.route('/otherHousesICantRemember')
#def otherHousesICantRemember():
#    """Renders the about page."""
#    return render_template(
#        'otherHousesIcantRemember.html',
#        title="I'm pretty sure we have other houses i think...",
#        year=datetime.now().year,
#        message='I know there is others...'
#    )

#@app.route('/shiningStar')
#def shiningStar():
#    """Renders the about page."""
#    return render_template(
#        'shiningStar.html',
#        title='About',
#        year=datetime.now().year,
#        message='King of the Kastle.  This House is King of the Kastle.'
#    )
