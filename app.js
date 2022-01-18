// NodeJs Examples


////////  RENEW:/ID GET  /////////////////////
//////////////////////////////////////////////
app.get("/renew/:id", async (req, res, next) => {
  if (req.cookies.renewPage !== undefined) {
    const token = await req.cookies.renewPage;

    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        console.log(err);
      } else {
        const decoded_token = await jwt.verify(token, secret);
        const user_info = {
          _id: decoded_token.id,
        };
        const tokenId = await `${user_info._id}`;
        const idJob = await req.params.id;
        if (tokenId === idJob) {
          try {
            const job = await db.Job.findById(req.params.id, {
              __v: 0,
            });
            console.log("Access to /update");
            console.log(job);
            return success(res, job);
          } catch (err) {
            res.redirect("/denied");
          }
          next();
        }
      }
    });
  } else {
    await res.redirect("/denied");
  }
});





////////  REMOVE  FOLDERS  ///////////////////
//////////////////////////////////////////////
const logosDel = setInterval(() => {
  const logosFolder = "./client/public/logos";
  const dirLogos = [];

  fs.readdir(logosFolder, async (err, files) => {
    files.forEach((file) => {
      dirLogos.push(file);
    });

    const logoArray = [];
    const jobs = db.Job.find({});
    const jobsList = await jobs.map((i) => i);
    const logoList = jobsList.filter((i) =>
        i.logoUrl !== undefined ? i.logoUrl : null
    );
    const allLg = logoList.filter((i) =>
        i.logoUrl !== false ? i.logoUrl : null
    );
    const allLogos = await allLg.map((i) => i.logoUrl.slice(7, -9));

    const difference = dirLogos.filter((x) => !allLogos.includes(x));
    await difference.forEach((element) =>
        rimraf(`./client/public/logos/${element}`, function () {
          console.log("folder deleted!");
        })
    );
  });
}, 24 * hour);




