const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const formidable = require("formidable");
const googleStorage = require("@google-cloud/storage");

const uuid = require("uuid-v4");
const Multer = require("multer");
var config = {
  projectId: "pr0112-duan1",
  keyFilename: "./serviceFirebase.json",
};

// const storage = require('@google-cloud/storage')
const { Storage } = require("@google-cloud/storage");
const gcs = new Storage({
  projectId: "pr0112-duan1",
  keyFilename: "./serviceFirebase.json",
});
const bucket = gcs.bucket("pr0112-duan1.appspot.com");

app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
const router = express();

//firebase
var firebase = require("firebase-admin");

var serviceAccount = require("./serviceFirebase.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://pr0112-duan1.firebaseio.com",
});

//connect firebase
var db = firebase.database();

var food = db.ref("Food");

var cate = db.ref("Category");

var user = db.ref("User");

var hoadon = db.ref("Bill");

var hoadonchitiet = db.ref("Bill/foods");
// food.once('value',function(snap)
//   {
//     console.log({"food":snap.val()});
//   }
// );

async function getAllFoods() {
  return await food.once("value", function (snap) {
    const temp = snap.val();
    return temp;
  });
}

async function getAllCateFood() {
  return await cate.once("value", function (snap) {
    const temp1 = snap.val();
    return temp1;
  });
}

async function getAllUser() {
  return await user.once("value", function (snap) {
    const temp2 = snap.val();
    return temp2;
  });
}

async function getAllHoaDon() {
  return await hoadon.once("value", function (snap) {
    const temp3 = snap.val();
    return temp3;
  });
}

async function getAllHoaDonChiTiet(bill_id) {
  var hoaDonChiTiet = (await hoadon.once("value")).val();
  // console.log('bb', hoaDonChiTiet[bill_id]);

  return hoaDonChiTiet[bill_id];
}

// var a = await getAllHoaDonChiTiet('1590829888816');
// console.log('aa:', a);
// console.log(a);
// console.log(getAllFoods().then(data => console.log(data.val())));

// //router
var path = require("path");
const { Router } = require("express");

var mon1 = [
  {
    id: 1,
    idloai: 1,
    ten: "pizza phap",
    gia: 175000,
    hinh: "1601621017314.jpg",
  },
  {
    id: 2,
    idloai: 2,
    ten: "bugger gà phô mai",
    gia: 65000,
    hinh: "1601621017314.jpg",
  },
  {
    id: 3,
    idloai: 3,
    ten: "phở bò",
    gia: 450000,
    hinh: "1601621017314.jpg",
  },
];

var users1 = [
  {
    hinh: "1601621017314.jpg",
    ten: "minh",
    username: "minhlun",
    password: 123,
    sodienthoai: "0357980104",
    gioitinh: "Nam",
    quyensudung: "Admin",
  },
  {
    hinh: "1601621017314.jpg",
    ten: "hung",
    username: "anhhung",
    password: 123,
    sodienthoai: "09121855855",
    gioitinh: "Nam",
    quyensudung: "Admin",
  },
  {
    hinh: "1601621017314.jpg",
    ten: "minhne",
    username: "minhlunscs",
    password: 123,
    sodienthoai: "0357980104",
    gioitinh: "Nam",
    quyensudung: "User",
  },
];

var hoadon1 = [
  {
    id: 1,
    tonggia: 200000,
    hinh: "1601631747036.jpg",
  },
  {
    id: 2,
    tonggia: 100000,
    hinh: "1601631747036.jpg",
  },
  {
    id: 3,
    tonggia: 300000,
    hinh: "1601631747036.jpg",
  },
];

var hoadonchitiet1 = [
  {
    hinh: "1601631747036.jpg",
    billid: 1,
    id: 1,
    foodname: "buggeer",
    quantity: 2,
    tonggia: 200000,
  },
  {
    hinh: "1601631747036.jpg",
    billid: 2,
    id: 2,
    foodname: "PHO",
    quantity: 2,
    tonggia: 200000,
  },
  {
    hinh: "1601631747036.jpg",
    billid: 3,
    id: 3,
    foodname: "dui ga",
    quantity: 2,
    tonggia: 200000,
  },
];

var pros1 = [
  {
    id: 1,
    ten: "pizza",
    hinh: "1601628112386.jpg",
  },
  {
    id: 2,
    ten: "bugger",
    hinh: "1601628112386.jpg",
  },
  {
    id: 3,
    ten: "pho",
    hinh: "1601628112386.jpg",
  },
];

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

router.get("/", function (request, response) {
  response.render("home", { title: "Trang chu" });
});

router.get("/login", function (request, response) {
  response.render("login");
});

router.get("/users", function (request, response) {
  var users = [
    {
      id: 1,
      name: "Hung",
      cmnd: "254565648",
      sdt: "09121855855",
    },
    {
      id: 2,
      name: "Minh",
      cmnd: "026023102",
      sdt: "0357980104",
    },
  ];

  response.render("list-user", { users: users });
});

router.get("/about", function (request, response) {
  response.render("about");
});

router.get("/hoadonchitiet/:bill_id", function (request, response) {
  const billId = request.params.bill_id;

  getAllHoaDonChiTiet(billId).then((data) => {
    console.log(data);

    response.render("hoadonchitiet", { hoadonchitiet1: data });
  });
});

router.get("/user", function (request, response) {
  getAllUser().then((data) => {
    console.log(Object.values(data.val()));

    response.render("user", { users1: Object.values(data.val()) });
  });
});

router.get("/hoadon", function (request, response) {
  getAllHoaDon().then((data) => {
    console.log(Object.values(data.val()));

    response.render("hoadon", { hoadon1: Object.values(data.val()) });
  });
});

router.get("/loaiproduct", function (request, response) {
  getAllCateFood().then((data) => {
    console.log(Object.values(data.val()));

    response.render("loaiproduct", { pros1: Object.values(data.val()) });
  });
});

router.get("/product", async function (request, response) {
  // await getAllFoods().then(data => console.log(data.val()));

  // var a = await getAllCateFood();
  // var b = await getAllFoods();

  // Promise.all([a,b]).then(values => {
  //   var c = values.forEach(value => console.log(value.val()));
  //   // console.log(c);
  //   response.render("product", { mon1: Object.values(data.val()), category:  });
  // })

  await getAllFoods().then((data) => {
    console.log(Object.values(data.val()));
    response.render("product", { mon1: Object.values(data.val()) });
  });
});

router.get("/edituser/:usname", function (request, response) {
  getAllUser().then((data) => {
    const allusers = data.val();
    const user = Object.values(allusers).find(
      (f) => f.usname == request.params.usname
    );
    console.log(user);

    if (user === undefined) {
      response.render("error");
    }
    response.render("edituser", { userCanUpdate: user });
  });
});

router.get("/deleteuser/:usname", function (request, response) {
  getAllUser().then((data) => {
    const allusers = data.val();
    const user = Object.values(allusers).find(
      (f) => f.usname == request.params.usname
    );
    console.log(user);
    if (user === undefined) {
      response.render("error");
      return;
    }
    response.render("deleteuser", { userCanDelete: user });
  });
});

router.get("/editmonan/:foodid", function (request, response) {
  getAllFoods().then((data) => {
    const allfoods = data.val();
    const food = Object.values(allfoods).find(
      (f) => f.foodid == request.params.foodid
    );
    console.log(food);
    if (food === undefined) {
      response.render("error");
      return;
    }
    response.render("editmonan", { monanCanUpdate: food });
  });

  //

  // console.log(monan);
  //
});

router.get("/deletemonan/:foodid", function (request, response) {
  getAllFoods().then((data) => {
    const allfoods = data.val();
    const food = Object.values(allfoods).find(
      (f) => f.foodid == request.params.foodid
    );
    console.log(food);

    if (food === undefined) {
      response.render("error");
      return;
    }
    response.render("deletemonan", { monanCanDelete: food });
  });
});

router.get("/editloaimonan/:categoryid", function (request, response) {
  getAllCateFood().then((data) => {
    const allcatefoods = data.val();
    const catefood = Object.values(allcatefoods).find(
      (f) => f.categoryid == request.params.categoryid
    );
    console.log(catefood);
    if (catefood === undefined) {
      response.render("error");
      return;
    }
    response.render("editloaimonan", { loaimonanCanUpdate: catefood });
  });
});

router.get("/deleteloaimonan/:categoryid", function (request, response) {
  getAllCateFood().then((data) => {
    const allcatefoods = data.val();
    const catefood = Object.values(allcatefoods).find(
      (f) => f.categoryid == request.params.categoryid
    );

    console.log(catefood);

    if (catefood === undefined) {
      response.render("error");
      return;
    }
    response.render("deleteloaimonan", { loaimonanCanDelete: catefood });
  });
});

router.get("/edithoadon/:billid", function (request, response) {
  getAllHoaDon().then((data) => {
    const allhoadons = data.val();
    const hoadon = Object.values(allhoadons).find(
      (f) => f.billid == request.params.billid
    );
    console.log(hoadon);
    if (hoadon === undefined) {
      response.render("error");
      return;
    }
    response.render("edithoadon", { hoadonCanUpdate: hoadon });
  });
});

router.get("/deletehoadon/:billid", function (request, response) {
  getAllHoaDon().then((data) => {
    const allhoadons = data.val();
    const hoadon = Object.values(allhoadons).find(
      (f) => f.billid == request.params.billid
    );

    console.log(hoadon);

    if (hoadon === undefined) {
      response.render("error");
      return;
    }
    response.render("deletehoadon", { hoadonCanDelete: hoadon });
  });
});

router.post("/insertProduct", (req, res) => {
  console.log(req.body);
  // console.log('aa');
  const dateTimeName = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (mon1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      //console.log(fields);

      bucket.upload(
        files.myImage.path,
        {
          public: true,
          gzip: true,
          metadata: {
            firebaseStorageDownloadTokens: uuid(),
            cacheControl: "public, max-age=31536000",
          },
        },
        (err, file, callback) => {
          if (err) console.log("loi 2");

          // console.log(file.metadata);
          // let ok = false
          food
            .push()
            .set({
              categorid: fields.MaLoaiMonAn,
              foodid: fields.MaMonAn,
              foodimage: file.metadata.mediaLink,
              foodname: fields.TenMon,
              price: parseInt(fields.GiaMonAn),
            })
            .catch((err) => {
              console.log("loi");
            });
        }
      );
    });

  res.redirect(200, "/product");
});

router.post("/updateProduct", (req, res) => {
  const dateTimeName = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (mon1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      bucket.upload(
        files.myImageEdit.path,
        {
          public: true,
          gzip: true,
          metadata: {
            firebaseStorageDownloadTokens: uuid(),
            cacheControl: "public, max-age=31536000",
          },
        },
        (err, file, callback) => {
          if (err) console.log("loi 2");
          getAllFoods().then((data) => {
            const allfoods = data.val();
            const foodLocal = Object.entries(allfoods).filter((f) => {
              // console.log(f[1].foodid);
              return f[1].foodid == fields.MaMonAn;
            });
            console.log(foodLocal);
            if (foodLocal.length == 0) {
              res.render("about");
              return;
            }
            var ref = food.child(foodLocal[0][0]);
            ref.update({
              foodimage: file.metadata.mediaLink,
              foodname: fields.TenMon,
              price: parseInt(fields.GiaMonAn),
            });
            res.render("editmonan", { monanCanUpdate: foodLocal[0] });
          });
        }
      );
    });

  res.redirect(200, "/product");
});

router.post("/deleteProduct", (req, res) => {
  const dateTimeName = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (mon1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      const foodId = fields.MaMonAn;

      food.once("value").then(function (snapshot) {
        let ok = false;
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().foodid === foodId) {
            food.child(childSnapshot.key).remove();
            ok = true;

            return;
          }
        });
        if (ok) res.status(200).redirect("product");
        else res.render("error");
      });
    });
});

router.post("/insertLoaiProduct", (req, res) => {
  console.log(req.body);
  // console.log('aa');
  const dateTimeName1 = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName1);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (pros1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      // console.log(fields);
      // Create a root reference
      // console.log(files.myImage.path);
      // return;
      bucket.upload(
        files.myImage.path,
        {
          public: true,
          gzip: true,
          metadata: {
            firebaseStorageDownloadTokens: uuid(),
            cacheControl: "public, max-age=31536000",
          },
        },
        (err, file, callback) => {
          if (err) console.log("loi 2");

          // console.log(file.metadata);
          // let ok = false
          cate
            .push()
            .set({
              categoryid: fields.MaLoaiMonAn,
              name: fields.TenLoaiMonAn,
              image: file.metadata.mediaLink,
            })
            .catch((err) => {
              console.log("loi");
            });
          // ok = true;
          // return;

          // .then((result) => {
          //   const createPersistentDownloadUrl = (
          //     bucket,
          //     pathToFile,
          //     downloadToken
          //   ) => {
          //     return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
          //       pathToFile
          //     )}?alt=media&token=${downloadToken}`;
          //   };

          //   console.log(createPersistentDownloadUrl);
          // })

          // if(ok)
          //   res.status(200).redirect("loaiproduct");
          // else
          //   res.render("error");
        }
      );
    });

  res.redirect(200, "/loaiproduct");
});

router.post("/updateLoaiProduct", (req, res) => {
  const dateTimeName1 = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName1);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (pros1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      bucket.upload(
        files.myImageEdit.path,
        {
          public: true,
          gzip: true,
          metadata: {
            firebaseStorageDownloadTokens: uuid(),
            cacheControl: "public, max-age=31536000",
          },
        },
        (err, file, callback) => {
          if (err) console.log("loi 2");
          getAllCateFood().then((data) => {
            const allcatefoods = data.val();
            const catefoodLocal = Object.entries(allcatefoods).filter((f) => {
              // console.log(f[1].foodid);
              return f[1].categoryid == fields.MaLoaiMonAn;
            });
            console.log(catefoodLocal);
            if (catefoodLocal.length == 0) {
              res.render("about");
              return;
            }
            var ref = cate.child(catefoodLocal[0][0]);
            ref.update({
              // "categoryid:": fields.MaLoaiMonAn,
              name: fields.TenLoaiMonAn,
              image: file.metadata.mediaLink,
            });
            res.render("editloaimonan", {
              loaimonanCanUpdate: catefoodLocal[0],
            });
          });
        }
      );
    });
  res.redirect(200, "/loaiproduct");
});

router.post("/deleteLoaiProduct", (req, res) => {
  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  }).parse(req, (err, fields, files) => {
    // console.log(fields);

    const categoryId = fields.MaLoaiMonAn;
    // var key = cate.childs();
    cate.once("value").then(function (snapshot) {
      let ok = false;
      snapshot.forEach(function (childSnapshot) {
        // console.log(childSnapshot.val().categoryid, '-', categoryId,childSnapshot.val().categoryid === categoryId)
        if (childSnapshot.val().categoryid === categoryId) {
          cate.child(childSnapshot.key).remove();
          ok = true;

          return;
        }
      });

      if (ok) res.status(200).redirect("loaiproduct");
      else res.render("error");
    });
  });
});

router.post("/insertUser", (req, res) => {
  console.log(req.body);
  // console.log('aa');
  const dateTimeName2 = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName2);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (users1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      console.log(fields);
      users1.push({
        hinh: dateTimeName2,
        ten: fields.TenKhachHang,
        username: fields.TenDangNhap,
        password: fields.MatKhau,
        sodienthoai: fields.SoDienThoai,
        gioitinh: fields.GioiTinh,
        quyensudung: fields.QuyenSuDung,
      });
    });

  res.redirect(200, "/user");
});

router.post("/updateUser", (req, res) => {
  const dateTimeName2 = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName2);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (users1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      getAllUser().then((data) => {
        const allusers = data.val();
        const userLocal = Object.entries(allusers).filter((f) => {
          return f[1].usname == fields.TenDangNhap;
        });
        console.log(userLocal);
        if (userLocal.length == 0) {
          res.render("about");
          return;
        }
        var ref = user.child(userLocal[0][0]);
        ref.update({
          fullname: fields.TenKhachHang,
          password: fields.MatKhau,
          phone: fields.SoDienThoai,
          gender: fields.GioiTinh,
          ruler: fields.QuyenSuDung,
        });
        res.render("edituser", { userCanUpdate: userLocal[0] });
      });
    });

  res.redirect(200, "/user");
});

router.post("/deleteUser", (req, res) => {
  const dateTimeName2 = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName2);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (users1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      const userId = fields.TenDangNhap;

      user.once("value").then(function (snapshot) {
        let ok = false;

        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().usname === userId) {
            user.child(childSnapshot.key).remove();
            ok = true;

            return;
          }
        });

        if (ok) res.status(200).redirect("user");
        else res.render("error");
      });
    });
});

router.post("/insertHoaDon", (req, res) => {
  console.log(req.body);
  // console.log('aa');
  const dateTimeName3 = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName3);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (hoadon1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      console.log(fields);
      hoadon1.push({
        hinh: dateTimeName3,
        id: fields.MaHoaDon,
        tonggia: fields.TongGia,
      });
    });

  res.redirect(200, "/hoadon");
});

router.post("/updateHoaDon", (req, res) => {
  const dateTimeName3 = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName3);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (hoadon1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      getAllHoaDon().then((data) => {
        const allhoadons = data.val();
        const hoadonLocal = Object.entries(allhoadons).filter((f) => {
          // console.log(f[1].foodid);
          return f[1].billid == fields.MaHoaDon;
        });
        console.log(hoadonLocal);
        if (hoadonLocal.length == 0) {
          res.render("about");
          return;
        }
        var ref = hoadon.child(hoadonLocal[0][0]);
        ref.update({
          date: fields.NgayTao,
          address: fields.DiaChi,
          payments: fields.ThanhToan,
          state: fields.TrangThai,
          total: parseInt(fields.TongGia),
          username: fields.TenDangNhap,
        });
        res.render("edithoadon", { hoadonCanUpdate: hoadonLocal[0] });
      });
    });

  res.redirect(200, "/hoadon");
});

router.post("/deleteHoaDon", (req, res) => {
  const dateTimeName3 = Date.now() + ".jpg";

  new formidable.IncomingForm({
    hash: "md5",
    maxFileSize: 2000 * 1024 * 1024,
    keepExtensions: true,
    multiples: true,
  })
    .on("fileBegin", function (filename, file) {
      console.log(filename);
      file.path = path.join("D:/Exmaple01/Exmaple01/public", dateTimeName3);
      console.log(file.path);
    })
    .on("file", async function (name, file) {
      console.log(name);
    })
    .on("aborted", (hoadon1) => {
      console.log("aborted");
    })
    .on("error", (err) => {
      console.log(err);
      res.sendStatus(400);
      return;
    })
    .on("end", () => console.log("end"))
    .parse(req, (err, fields, files) => {
      const hoadonId = fields.MaHoaDon;

      hoadon.once("value").then(function (snapshot) {
        let ok = false;
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().billid === hoadonId) {
            hoadon.child(childSnapshot.key).remove();
            ok = true;
            return;
          }
        });

        if (ok) res.status(200).redirect("hoadon");
        else res.render("error");
      });
    });
});


//// Lấy IP theo máy tính

var os = require("os");

var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ("IPv4" !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ":" + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

app.use("/", router);

app.use("/css", express.static(__dirname + "/css"));

app.listen(3000, () => {
  console.log("http:localhost:3000");
});
