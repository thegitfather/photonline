//db = connect("127.0.0.1:27017/photonline-dev");
print("db.galleries dropped:", db.galleries.remove({}));
print("db.photos dropped:", db.photos.remove({}));
