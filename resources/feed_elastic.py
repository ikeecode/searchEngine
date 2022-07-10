from csv import DictReader
from pprint import pprint
from elasticsearch import Elasticsearch


es = Elasticsearch("http://localhost:9200")
INDEX_NAME = "spotify"


def feedElastic():
    with open("spotify_dataset.csv", "r") as target:
        data = DictReader(target)
        for i, item in enumerate(data):
            es.index(index=INDEX_NAME, id=i, body=item)
            # break

def fromElastic(search=""):
    try:
        return es.search(
        index=INDEX_NAME,
        query={
            "query_string" : {
                "query" : search
            }
        }).get('hits').get('hits')
    except:
        return False

#
# response = fromElastic("india")
# # data = response.get('hits').get('hits')
#
# for hit in response:
#     # pprint(hit)
#     hit_data = hit.get('_source')
#     pprint(hit_data)
#     break


LYRICS_INDEX = "lyrics"
with open('h_artists_songs.csv', 'r') as target:
    data = DictReader(target)
    for i, item in enumerate(data):
        es.index(index=LYRICS_INDEX, id=i, body=item)
        # break
