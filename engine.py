from flask import Flask, jsonify, render_template
from elasticsearch import Elasticsearch



engine = Flask(__name__)
es = Elasticsearch("http://localhost:9200")
INDEX_NAME = "spotify"
LYRICS_INDEX = "lyrics"



def search_option(myindex, mysearch):
    data = es.search(
        index=myindex,
        query={
            "query_string" : {
                "query" : mysearch
            }
        }
    ).get('hits').get('hits')

    return data

@engine.route('/')
def engineHome():
    return render_template('engine.html')



@engine.route('/<option>/<search>', methods=['GET'])
def searchInput(option, search):
    if option == 'song':
        data = search_option(INDEX_NAME, search)
        return jsonify(data), 200

    if option == 'lyrics':
        data = search_option(LYRICS_INDEX, search)
        return jsonify(data), 200


@engine.route('/demographic', methods=['GET'])
def searchPopulation():
    return jsonify("{'message': 'this is some young generation'}"), 200 


if __name__ == '__main__':
    engine.run(debug=True)
