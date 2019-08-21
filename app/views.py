import os

from flask import render_template, send_from_directory
from werkzeug.routing import PathConverter
from app import app
from app.tables import versions


class RM_FSlashConverter(PathConverter):
    regex = '.*?'

app.url_map.converters['rm_fslash'] = RM_FSlashConverter


@app.template_filter('autoversion')
# https://ana-balica.github.io/2014/02/01/autoversioning-static-assets-in-flask
def autoversion_filter(filename):
    fullpath = os.path.join('app/', filename[1:])
    try:
        timestamp = str(os.path.getmtime(fullpath))
    except OSError:
        return filename
    newfilename = "{0}?v={1}".format(filename, timestamp)
    return newfilename


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/robots.txt')
def robotstxt():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'robots.txt', mimetype='text/plain')


@app.route('/sitemap.xml')
def sitemap():
    # #Mid_Priority:10 Set up sitemap (http://flask.pocoo.org/snippets/108/)
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'sitemap.xml', mimetype='application/xml')


@app.route('/')
@app.route('/index.htm')
@app.route('/index.html')
def homepage():
    return render_template('homepage.html')


@app.route('/databases/<rm_fslash:db_name>')
@app.route('/databases/<string:db_name>/index.htm')
@app.route('/databases/<string:db_name>/index.html')
def db_reader(db_name):
    return render_template(
        'db_viewer.html',
        db_name=db_name,
        db_version=versions[db_name]
    )


@app.route('/database/<string:db_name>/quiz')
@app.route('/databases/<string:db_name>/quiz/')
@app.route('/databases/<string:db_name>/quiz/index.htm')
@app.route('/databases/<string:db_name>/quiz/index.html')
def quiz(db_name):
    return render_template(
        'quiz.html',
        db_name=db_name,
        db_version=versions[db_name]
    )


@app.route('/database/<string:db_name>/gallery')
@app.route('/databases/<string:db_name>/gallery/')
@app.route('/databases/<string:db_name>/gallery/index.htm')
@app.route('/databases/<string:db_name>/gallery/index.html')
def gallery(db_name):
    return render_template(
        'gallery.html',
        db_name=db_name
    )


@app.errorhandler(403)
@app.errorhandler(404)
@app.errorhandler(410)
@app.errorhandler(500)
def web_error(error):
    # temp_obj = {}
    # for method in dir(error):
    #     temp_obj[method] = eval("error.{}".format(method))
    error_obj = {
        "name": error.name,
        "code": error.code,
        "description": error.description
    }
    return render_template(
        'error.html',
        error=error_obj
    ), error.code
