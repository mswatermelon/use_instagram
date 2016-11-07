var token = '691623.1419b97.479e4603aff24de596b1bf18891729f3',
   userid = 691623,
   count = 20;

$.ajax({
   url: 'https://api.instagram.com/v1/users/' + userid + '/media/recent',
   dataType: 'jsonp',
   type: 'GET',
   data: {
      access_token: token,
      count: count
   },
   success: processingData,
   error: function(data) {
      console.log(data);
   }
});

function timeAgo(time){
  var date = new Date(parseInt(time) * 1000),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400);

  if ( isNaN(day_diff) || day_diff < 0)
      return;

  return day_diff == 0 && (
          diff < 60 && "just now" ||
          diff < 3600 && Math.floor( diff / 60 ) + "m" ||
          diff < 86400 && Math.floor( diff / 3600 ) + "h") ||
      day_diff < 7 && day_diff + "d" ||
      day_diff >= 7 && Math.ceil( day_diff / 7 ) + "w";
}

function createItem (params){
  var photoDiv = document.createElement('div'),
      header = document.createElement('div'),
      name = document.createElement('div'),
      img = document.createElement('div'),
      comment = document.createElement('comment'),
      html = "";

  photoDiv.setAttribute("class", "photoDiv");

  for(var key in params){
    var type = params[key][1],
        el = document.createElement(type);

    el.setAttribute("class", key);
    if (type == "p" || type == "div"){
      el.innerHTML = params[key][0];
    }
    if(type == "img"){
      el.src = params[key][0];
    }
    params[key] = el;
    // photoDiv.appendChild(el);
  }

  header.setAttribute("class", "header");
  name.setAttribute("class", "name");
  img.setAttribute("class", "img");
  comment.setAttribute("class", "comment");

  header.appendChild(params["profile_picture"]);
  name.appendChild(params["username"]);
  name.appendChild(params["full_name"]);
  header.appendChild(name);
  header.appendChild(params["time"]);
  img.appendChild(params["image"]);
  comment.appendChild(params["likes"]);
  comment.appendChild(params["text"]);

  photoDiv.appendChild(header);
  photoDiv.appendChild(img);
  photoDiv.appendChild(comment);

  return photoDiv;
}

function processingData(data) {
  console.log(data);
   var photoItems = data.data;

   photoItems.forEach((item) => {
     var params = {
       "profile_picture": [item.caption.from.profile_picture,'img'],
       "username": [item.caption.from.username, 'div'],
       "full_name": [item.caption.from.full_name,'div'],
       "text": [item.caption.text,'p'],
       "likes": [item.likes.count,'p'],
       "image": [item.images.low_resolution.url,'img'],
       "time": [timeAgo(item.created_time), 'p'],
     }

    document.body.appendChild(createItem(params));
   })
};
