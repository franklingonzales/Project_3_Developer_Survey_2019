import os

import mysql.connector
from mysql.connector import errorcode

import pandas as pd
import numpy as np


from flask import Flask, jsonify, render_template
app = Flask(__name__)


#################################################
# Database Setup
#################################################
# Obtain connection string information from the portal
'''config = {
 'host':'localhost',
 'database':'db_myProject',
 'user':'root',
 'password':'MaddieLiana2018'
}'''
config = {
 'host':'gtbootcamp.mysql.database.azure.com',
 'user':'harish@gtbootcamp',
 'password':'JsOverload!23'
}

# strQuery = "SELECT * FROM table1";
strQuery = "SELECT * FROM jsoverload.table1"

@app.route("/")
def index():
    try:
        conn = mysql.connector.connect(**config)
        df = pd.read_sql_query(strQuery, conn)
        df.to_csv('table1.csv')
        conn.close()
        return render_template('index.html')
    except mysql.connector.Error as err:
        return "Something went wrong: {}".format(err)
    
    # Return the homepage.
    # return render_template("index.html")


@app.route("/record/<queryYear>")
def returnRecPerYear(queryYear):
    # queryTear content the year of the query between 2011 - 2019
    # conn = mysql.connector.connect(**config)
    
    #df = pd.read_sql_query(strQuery, conn)
    #conn.close()
    df = pd.read_csv('table1.csv');

    # Return a list with the content of the specific record like a row
    
    # we create a list with all years
    lyears = list( df['year_sample'] )
    # we to get queryyear index
    indexYear = lyears.index(int(queryYear))
    # Return a record of the year specified into queryYear with its header
    myDict = dict(  zip(  list(df.columns)[0:22], list(df.iloc[[indexYear][0]])  )  )
    return jsonify(myDict)


@app.route("/whatLanguages")
def returnlistOfLanguages():
    # queryTear content the year of the query between 2011 - 2019
    #conn = mysql.connector.connect(**config)
    
    df = pd.read_csv('table1.csv');
    #conn.close()
    # Return a list with the content of the specific record like a row
    return jsonify(list(df.columns )[2:20])


@app.route("/language/<languageName>")
def returnDictPerLanguage(languageName):
    # languageName content the name of language programming
    # conn = mysql.connector.connect(**config)
    
    df = pd.read_csv('table1.csv');
    # conn.close()

    # Return a record of the values per year, about of specific language
    myDict = dict( zip( list(df['year_sample']),list(df[languageName]) ) )
    
    return jsonify( myDict  )

if __name__ == "__main__":
    app.run()
