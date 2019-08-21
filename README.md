# Field Studies Flask Application
For use in identifying Arizona birds, amphibians, reptiles, and plants

# Installation
*NOTE: Requires Python 3.6+*  
1. Create virtual env: `py -3 -m venv venv`
2. Activate virtual env
    a. Windows: `venv\Scripts\activate`
    b. Linux\Mac: `source venv/bin/activate`
3. Install packages: `pip install -r requirements.txt`
4. Run the app: `python run.production.py`  

*You may want to update the packages to prevent security vulnerabilities. This can be done via `pip install --upgrade -r requirements.txt`*

# Improvements
**NOTE:** This is my first flask project. I've learnt a lot that can be done differently. If I were to redo it, I would make the following changes:  
1. Using blueprints
2. Unified database with different tables for each category
3. Using `flask run` instead of a python file
4. Use of Flask-Bootstrap
5. Use of Flask macros and Flask include statements
6. Many more things that I can't remember
