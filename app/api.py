from flask import jsonify, url_for
from app import app, logger, db_data
from app.tables import tables, versions
from app.views import web_error

global db_data


def get_db_data(db_name, _id=None):
    # #Low_Priority:30 Api errors http://flask.pocoo.org/docs/0.11/patterns/apierrors/
    global db_data

    try:
        if _id:
            _id -= 1
            return [db_data[db_name][_id]]
        return db_data[db_name]
    except:
        return "Error", 500


@app.route('/api/get-info/<string:db_name>')
@app.route('/api/get-info/<string:db_name>/')
def api(db_name):
    try:
        tables[db_name]
        return "Valid API endpoint"
    except:
        return "Invalid API endpoint"
    return "API ({db_name})".format(db_name=db_name)


@app.route('/api/get-info/<string:db_name>/id/<int:a_id>')
@app.route('/api/get-info/<string:db_name>/id/<int:a_id>/')
def api_popup(db_name, a_id):
    return "/api/get-info/<db_name>/id/<id> removed. Please clear localStorage and cache", 301


@app.route('/api/get-info/<string:db_name>/all')
@app.route('/api/get-info/<string:db_name>/all/')
def api_get_all(db_name):
    try:
        columns = tables[db_name]
        rows = get_db_data(db_name)
        result = [dict(zip(columns, row)) for row in rows]

        return jsonify(result)
    except Exception as e:
        logger.error("Exception with api_get_all(): {}".format(e))
        return "Error", 500


@app.route('/api/get-info/<string:db_name>/table')
@app.route('/api/get-info/<string:db_name>/table/')
def api_get_table(db_name):
    try:
        return jsonify(tables[db_name])
    except Exception as e:
        logger.error("Exception with api_get_table(): {}".format(e))
        return "Error", 500
