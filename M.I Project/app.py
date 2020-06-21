## 건드리지 않는 부분
from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

from pymongo import MongoClient           # pymongo를 임포트 하기(패키지 인스톨 먼저 해야겠죠?)
client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로 돌아갑니다.
db = client.dbsparta                      # 'dbsparta'라는 이름의 db를 만듭니다.

## HTML을 주는 부분
@app.route('/')
def home():
    return render_template('index.html')

## API 역할을 하는 부분
# 입력시 내가 입력한 값들이 DB와 밑에 입력되는 API
@app.route('/postmetal', methods=['POST'])
def post_metal():
    date_receive = request.form['date_give']
    brand_receive = request.form['brand_give']
    kinds_receive = request.form['kinds_give']
    weights_receive = request.form['weights_give']
    count_receive = request.form['count_give']
    money_receive = request.form['money_give']
    grams_receive = request.form['grams_give']
    profit_receive = request.form['profit_give']

    doc = {
        'date':date_receive,
        'brand':brand_receive,
        'kinds':kinds_receive,
        'weights':weights_receive,
        'count':count_receive,
        'money':money_receive,
        'grams':grams_receive,
        'profit':profit_receive,
    }
    db.postmetal.insert_one(doc)
    
    return jsonify({'result':'success', 'msg': '입력이 완료되었습니다'})

# 로그인시 자료를 내려오는 API
@app.route('/postmetal', methods=['GET'])
def post_metal():
    
    postings = list(db.postmetal.find({},{'_id:0'}))

    return jsonify({'result':'success', 'all_posting' : postings})

## 건드리지 않는 부분
if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)