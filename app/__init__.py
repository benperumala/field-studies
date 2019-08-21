import os
import colorlog
import logging
import platform
import sqlite3

from flask import Flask

from app.tables import tables
global db_data

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))


def setup_logger():
    """Return a logger with a default ColoredFormatter."""
    print("Setting up logger...")
    # "[%(log_color)s%(levelname)-8s%(reset)s] %(message_log_color)s%(message)s",
    formatter = colorlog.ColoredFormatter(
        "[%(log_color)s%(levelname)s%(reset)s] %(message_log_color)s%(message)s",
        datefmt="%H:%M:%S %p",
        reset=True,
        log_colors={
            'DEBUG':    'cyan',
            'INFO':     'green',
            'WARNING':  'yellow',
            'ERROR':    'red',
            'CRITICAL': 'red',
        },
        secondary_log_colors={
            'message': {
                'DEBUG':    'cyan',
                'INFO':     'white',
                'WARNING':  'yellow',
                'ERROR':    'red',
                'CRITICAL': 'red',
            }
        }
    )

    # https://docstrings.wordpress.com/2014/04/19/flask-access-log-write-requests-to-file/
    logger = logging.getLogger('werkzeug')

    # Send all errors to errors.log
    handler = logging.FileHandler('errors.log')
    handler.setLevel(logging.ERROR)
    logger.addHandler(handler)
    app.logger.addHandler(handler)

    # Print all log data
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    app.logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)

    return logger


def db_setup(_tables):
    _data = {}
    for org in _tables:
        org_name = org.title()
        try:
            # db_path = os.path.dirname(os.path.realpath(sys.argv[0]))
            pltfm = platform.system()
            db_path = os.path.dirname(os.path.realpath(__file__))
            if pltfm == "Windows":
                db_path = "{}\\databases\\{}.sqlite3".format(db_path, org)
                db = sqlite3.connect('{}'.format(db_path), uri=True)
            elif pltfm == "Linux":
                db_path = "{}/databases/{}.sqlite3".format(db_path, org)
                db = sqlite3.connect('{}'.format(db_path))
            else:
                logger.critical("Invalid operating system!")
                raise Exception("Invalid OS")
            c = db.cursor()
            c.execute("SELECT * FROM {}".format(org_name))
            data = c.fetchall()
            _data[org] = data
        except Exception as e:
            logger.error("Exception with db_setup(): {}".format(e))
    return _data

logger = setup_logger()
db_data = db_setup(tables)
# logger.debug('DEBUG message')
# logger.info('INFO message')
# logger.warning('WARNING message')
# logger.error('ERROR message')
# logger.critical('CRITICAL message')

# TODO: Before running, minify all static files through NGINX
from app import views, api
