from flask import Flask ,jsonify,render_template,url_for,redirect,abort, request
from flask_sqlalchemy import *
import pymysql
from sqlalchemy import create_engine, MetaData, create_engine, MetaData, Table, Column, Date, Integer, String, ForeignKey
import json

app = Flask('test',template_folder='../templates',static_folder="../static")

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:love@localhost:3306/yidonghulian'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = 'True'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = 'True'

db = SQLAlchemy(app)
conn = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='love',
    db='yidonghulian',
    charset='utf8'
)

class sw_image(db.Model):
    __tablename__ = 'sw_image'
    img_id = db.Column(db.INT(), primary_key=True)
    img_ad = db.Column(db.VARCHAR(255))
    def to_dict(self):
        return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}

class talk(db.Model):
    __tablename__ = 'talk'
    talk_id = db.Column(db.INT(), primary_key=True)
    news_id = db.Column(db.INT())
    talk_time = db.Column(db.VARCHAR(255))
    talk_content = db.Column(db.VARCHAR(255))
    def to_dict(self):
        return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}

class shipiin(db.Model):
    __tablename__ = 'vidio'
    vid_id = db.Column(db.INT(), primary_key=True)
    vid_url = db.Column(db.VARCHAR(1255))
    vid_info = db.Column(db.VARCHAR(255))
    vid_tag = db.Column(db.VARCHAR(255))
    def to_dict(self):
        return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}

class admin(db.Model):
    __tablename__ = 'admin'
    admin_id = db.Column(db.INT(), primary_key=True)
    admin_name = db.Column(db.VARCHAR(255))
    admin_pw = db.Column(db.VARCHAR(255))
    def to_dict(self):
        return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}

class xinwen(db.Model):
    __tablename__ = 'news'
    news_id = db.Column(db.INT(), primary_key=True)
    news_title = db.Column(db.VARCHAR(255))
    news_tag = db.Column(db.VARCHAR(255))
    news_content = db.Column(db.TEXT(0))
    news_image = db.Column(db.VARCHAR(255))
    news_tag2 = db.Column(db.VARCHAR(255))
    news_zan = db.Column(db.INT())
    def to_dict(self):
        return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}

class shoucang(db.Model):
    __tablename__ = 'shoucang'
    shoucang_id = db.Column(db.INT(), primary_key=True)
    news_id = db.Column(db.INT())
    def to_dict(self):
        return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}

def getadmin(name,pw1):
    res = admin.query.filter_by(admin_name=name).first()
    if res == None:
        return 0
    res2 = res.to_dict()

    if res2['admin_pw'] == pw1:
        print(pw1)
        return 1
    return 2

def getswimage():
    l = list()
    rows = sw_image.query.count()
    for i in range(rows):
        res = sw_image.query.filter_by(img_id=i+1).first()
        print(res)
        while res == None:
            i += 1
            print("sdfadfaf")
            rows += 1
            res = sw_image.query.filter_by(img_id=i+1).first()
        l.append(res.to_dict())
    return (l)

def getnews():
    l = list()
    rows = xinwen.query.count()

    for i in range(rows):

        res = xinwen.query.filter_by(news_id=i).first()
        print(res)
        while res == None:
            i=1+i
            print("sdfadfaf")
            rows=1+rows
            res = xinwen.query.filter_by(news_id = i).first()
        l.append(res.to_dict())
    return (l)

def getnew(id):
    res = xinwen.query.filter_by(news_id=id).first()
    return(res.to_dict())

def deletenews(id):
    result = xinwen.query.filter_by(news_id=id).first()
    db.session.delete(result)
    db.session.commit()
    conn.commit()

def deleteimg(id):
    result = sw_image.query.filter_by(img_id=id).first()
    db.session.delete(result)
    db.session.commit()
    conn.commit()

def addnew( title, tag1, tag2, content, image, id, zans ):
    zan = int(zans)
    if int(id) == -1:
        rows = xinwen.query.filter_by().order_by(xinwen.news_id.desc()).first()
        rowss = rows.to_dict()
        last = rowss['news_id']
        cur = conn.cursor()
        sql = "INSERT INTO news (news_id , news_title , news_tag , news_content , news_image , news_tag2 , news_zan)" \
              " VALUES( '%s','%s' ,'%s','%s' ,'%s','%s','%s' )"
        cur.execute(sql%(int(last)+1,title,tag1,content,image,tag2,int(zan)))
    else:
        cur = conn.cursor()
        sql = "INSERT INTO news (news_id , news_title , news_tag , news_content , news_image , news_tag2 , news_zan)" \
              " VALUES( '%s','%s' ,'%s','%s' ,'%s','%s','%s' )"
        cur.execute(sql % (int(id), title, tag1, content, image, tag2, int(zan)))
    conn.commit()

def dianzan(id):
    ress = getnew(id)

    zan = ress['news_zan']
    title = ress['news_title']
    tag1 = ress['news_tag']
    tag2 = ress['news_tag2']
    content = ress['news_content']
    image = ress['news_image']
    zan = zan + 1
    deletenews(id)
    addnew(title, tag1, tag2, content, image, id ,zan)

def addvid(title , tag , url ,id):
    if int(id) == -1:
        rows = shipiin.query.filter_by().order_by(shipiin.vid_id.desc()).first()
        rowss = rows.to_dict()
        last = rowss['vid_id']
        cur = conn.cursor()
        sql = "INSERT INTO vidio (vid_id , vid_info , vid_tag , vid_url )" \
              " VALUES( '%s','%s' ,'%s','%s')"
        cur.execute(sql%(int(last) + 1, str(title), str(tag), str(url)))
    else:
        cur = conn.cursor()
        sql = "INSERT INTO vidio (vid_id , vid_info , vid_tag , vid_url )" \
              " VALUES( '%s','%s' ,'%s','%s')"
        cur.execute(sql % (int(id), str(title), str(tag), str(url)))
    conn.commit()

def addtalk(id,content):
    rows = talk.query.filter_by().order_by(talk.talk_id.desc()).first()
    rowss = rows.to_dict()
    last = rowss['talk_id']
    cur = conn.cursor()
    sql = "INSERT INTO talk (talk_id , news_id , talk_time , talk_content )" \
          " VALUES( '%s','%s' ,'%s','%s')"
    cur.execute(sql % (int(last)+1, str(id), str("2019-4-1"), str(content)))
    conn.commit()

def addimg(url):
    rows = sw_image.query.filter_by().order_by(sw_image.img_id.desc()).first()
    rowss = rows.to_dict()
    last = rowss['img_id']
    cur = conn.cursor()
    sql = "INSERT INTO sw_image (img_id,img_ad )" \
          " VALUES( '%s','%s')"
    cur.execute(sql % (int(last)+1, str(url)))
    conn.commit()

def deletevid(id):
    result = shipiin.query.filter_by(vid_id=id).first()
    db.session.delete(result)
    db.session.commit()
    conn.commit()

def getshoucang():
    l = list()
    rows = shoucang.query.count()
    for i in range(rows):
        res = shoucang.query.filter_by(shoucang_id=i).first()
        while res == None:
            i += 1
            rows += 1
            res = shoucang.query.filter_by(shoucang_id=i).first()
        ress = res.to_dict()
        resss = ress['news_id']
        ressss = xinwen.query.filter_by(news_id=resss).first()
        l.append(ressss.to_dict())
    return (l)

def getnewtalk(id):
    l = list()
    res = talk.query.filter_by(news_id = id)
    for i in res:
        l.append(i.to_dict())
    return l

def getvid1(id):
    res = shipiin.query.filter_by(vid_id=id).first()
    return (res.to_dict())

def getvid():
    l = list()
    rows = shipiin.query.count()

    for i in range(rows):
        res = shipiin.query.filter_by(vid_id=i+1).first()
        while res == None:
            i+=1
            rows+=1
            res = shipiin.query.filter_by(vid_id = i+1).first()
        l.append(res.to_dict())
    return (l)

@app.route('/vid',methods=['GET','POST'])
def vid():
    if request.method == 'POST':
        if (request.json):
            return jsonify('not json')
        else:
            result = getvid()
            if result == 'None':
                return jsonify('asfd')
            return jsonify(result)
    else:
        return jsonify('kkk')

@app.route('/delete',methods=['GET','POST'])
def delete():
    asdf = request.form.get('username')
    type = request.form.get('type')
    asdfg = int(asdf)
    print(str(type))
    if type == '1':
        deletenews(asdfg)
        return redirect('/demo')
    if type == '2':
        deletevid(asdfg)
        return redirect('/vid_html')
    if type == '3':
        deleteimg(asdfg)
        return redirect('/image_html')

@app.route('/demo',methods=['GET','POST'])
def demo():
    cur = conn.cursor()
    # get annual sales rank
    sql = "select * from news"
    cur.execute(sql)
    content = cur.fetchall()
    # 获取表头
    sql = "SHOW FIELDS FROM news"
    cur.execute(sql)
    labels = cur.fetchall()
    labels = [l[0] for l in labels]

    return render_template('/2/index.html',labels=labels, news=content)

@app.route('/demo/add',methods=['GET','POST'])
def addnews():
    if request.method == 'POST':
        title = request.form.get('title')
        tag1 = request.form.get('tag1')
        tag2 = request.form.get('tag2')
        content = request.form.get('content')
        image = request.form.get('image')
        addnew(title , tag1 , tag2 , content , image , -1 ,0)
        return redirect('/demo')
    else:
        return render_template('addnews.html')

@app.route('/updata',methods=['GET','POST'])
def updata():
    asdf = request.form.get('username')
    type = request.form.get('type')
    asdfg = int(asdf)
    print(type)
    if type == '1':
        new = getnew(asdfg)
        return render_template('updatanews.html',
                               news_id = new['news_id'],
                               news_title = new['news_title'],
                               news_tag = new['news_tag'],
                               news_tag2 = new['news_tag2'],
                               news_content = new['news_content'],
                               news_image = new['news_image'])
    if type == '2':
        new = getvid1(asdfg)
        return render_template('updatavid.html',
                               vid_id = new['vid_id'],
                               vid_url = new['vid_url'],
                               vid_info = new['vid_info'],
                               vid_tag = new['vid_tag'])
    return render_template('updatavid.html')

@app.route('/sw_image',methods=['GET','POST'])
def swimage():
    res = getswimage()
    return jsonify(res)

@app.route('/vid_html',methods=['GET','POST'])
def vid_html():
    cur = conn.cursor()
    # get annual sales rank
    sql = "select * from vidio"
    cur.execute(sql)
    content = cur.fetchall()
    # 获取表头
    sql = "SHOW FIELDS FROM vidio"
    cur.execute(sql)
    labels = cur.fetchall()
    labels = [l[0] for l in labels]
    return render_template('2/user.html',labels=labels, news=content)

@app.route('/image_html',methods=['GET','POST'])
def image_html():
    cur = conn.cursor()

    # get annual sales rank
    sql = "select * from sw_image"
    cur.execute(sql)
    content = cur.fetchall()

    # 获取表头
    sql = "SHOW FIELDS FROM sw_image"
    cur.execute(sql)
    labels = cur.fetchall()
    labels = [l[0] for l in labels]
    return render_template('2/image.html', labels=labels, news=content)

@app.route('/shoucang',methods=['GET','POST'])
def sshoucang():
    getshoucang()

@app.route('/updatenews',methods=['GET','POST'])
def updatanews():
    id = request.form.get('id')
    title = request.form.get('title')
    tag1 = request.form.get('tag1')
    tag2 = request.form.get('tag2')
    content = request.form.get('content')
    image = request.form.get('image')
    deletenews(id)
    addnew(title, tag1, tag2, content, image,id,0)
    return redirect('/demo')

@app.route('/updatavids',methods=['POST'])
def updatavids():
    id = request.form.get('id')
    title = request.form.get('title')
    tag = request.form.get('tag')
    url = request.form.get('url')
    deletevid(id)
    addvid(title , tag , url ,id)
    return redirect('/vid_html')

@app.route('/find_news',methods=['GET','POST'])
def find_new():
    id = request.form.get('id')
    cur = conn.cursor()
    sql = "SHOW FIELDS FROM news"
    cur.execute(sql)
    labels = cur.fetchall()
    labels = [l[0] for l in labels]

    sql = "SELECT * FROM news WHERE news_id = %s"
    cur.execute(sql%(int(id)))
    content = cur.fetchall()
    return render_template('/2/index.html', labels=labels, news=content)

@app.route('/talk_html',methods=['GET','POST'])
def talk_html():
    cur = conn.cursor()

    # get annual sales rank
    sql = "select * from talk"
    cur.execute(sql)
    content = cur.fetchall()

    # 获取表头
    sql = "SHOW FIELDS FROM talk"
    cur.execute(sql)
    labels = cur.fetchall()
    labels = [l[0] for l in labels]
    return render_template('2/talk.html', labels=labels, news=content)

@app.route('/vid_html/add',methods=['GET','POST'])
def addvids():
    if request.method == 'POST':
        title = request.form.get('title')
        tag = request.form.get('tag')

        url = request.form.get('url')
        addvid(title , tag , url , -1)
        return redirect('/vid_html')
    else:
        return render_template('addvid.html')

@app.route('/image_html/add',methods = ['GET','POST'])
def addimgss():
    if request.method == 'POST':
        url = request.form.get('url')
        addimg(url)
        return redirect('/image_html')
    else:
        return render_template('addimg.html')

@app.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'POST':
        id = request.form.get('Name')
        pw = request.form.get('Password')
        res = getadmin(id,pw)
        if res == 1:
            return redirect('/demo')
        else:
            return render_template('/index.html')
    else:
        return render_template('/index.html')

@app.route('/news', methods=['GET', 'POST'])
def news():
    if request.method == 'POST':
        if (request.json):
            return jsonify('not json')
        else:
            result = getnews()
            if  result == 'NULL':
                return jsonify('asfd')
            return jsonify(result)
    else:
        return jsonify('kkk')

@app.route('/getnewtalk',methods=['GET', 'POST'])
def getnew1():
    title = request.form.get('title')
    print(title)
    l = getnewtalk(title)
    return jsonify(l)

@app.route('/addtalk',methods=['GET', 'POST'])
def gettalkdasf():
    id = request.form.get('id')
    content = request.form.get('title')
    print(content)
    addtalk(id , content)
    return ('1')

@app.route('/dianzan',methods=['GET', 'POST'])
def dianzzan():
    id = request.form.get('id')
    print(id)
    dianzan(id)
    return ('1')

if __name__ == '__main__':
    app.run(debug=True)
