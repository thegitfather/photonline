//db = connect("localhost:27017/photobox-dev");
print("db.galleries dropped:", db.galleries.remove({}));
print("db.photos dropped:", db.photos.remove({}));
