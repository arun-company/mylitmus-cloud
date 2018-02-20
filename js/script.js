
$(document).ready(function(){
  setTimeout(function(){
    Webflow.ready()
  }, 1000)

  $("#search-box").keyup(function(){
    search = $(this).val();
     $('.div-block-2.w-inline-block').each(function(key, value){

        if ($(value).text().search(search) >= 0) {
          $(value).show()
        } else {
          $(value).hide()
        }
     })
  });
})

