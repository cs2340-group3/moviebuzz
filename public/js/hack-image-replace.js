/* globals $ */

$(document).ready(function() {
  // THIS IS A HACK. See
  // http://developer.rottentomatoes.com/forum/read/184444 for details.
  //
  // @meehol said (on 2/24/15):
  //   You can transform the URL from response to look like this:
  //
  //   FROM: http://resizing.flixster.com/Sp8CtoHrWWrL8eTVD93xbAHFdxw=
  //    /54x79/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/07/11180766_ori.jpg
  //
  //   TO: http://content6.flixster.com/movie/11/18/07/11180766_ori.jpg
  //
  // @FlixsterCS said (on 3/12/15):
  //   I would be careful of using shortcuts or other methods to access our
  //   images. We continue work on the API and soon these URLs may not function
  //   correctly.
  //
  //
  // Oh well. It's our only hope.

  var regex = /.*?(\/movie\/\d+\/\d+\/\d+\/\d+_ori\.jpg)/g;
  var replacement = 'http://content6.flixster.com$1';

  $('img[src*="flixster.com"]').attr('src', function(index, oldUrl) {
    return oldUrl.replace(regex, replacement);
  });
});

