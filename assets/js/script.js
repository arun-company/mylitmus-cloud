
$(document).ready(function(){
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
