$(".nav_sorting").click(function(){
  $(".nav_sorting").toggleClass("nav_active");
  var is_sorting = $(".nav_sorting").hasClass("nav_active");
  if (is_sorting) {
  	$( ".sorting_values" ).slideDown( '500' );
  }
  else
  {
	$( ".sorting_values" ).slideUp('500');
  }
});
$(".nav_search, .nav_filter, .nav_download").click(function(){
	var is_sorting = $(".nav_sorting").hasClass("nav_active");
	if (is_sorting) {
	$(".nav_sorting").removeClass("nav_active");
	$( ".sorting_values" ).slideUp('500');
	}
});
$("#enableFilter").click(function(){
	$("body").addClass("modal-open");
	$("#modalFilter").addClass("enable");
});
$(".closefilter").click(function(){
	$("#modalFilter").removeClass("enable");
	$("body").removeClass("modal-open");
});
$("#enableDownloads").click(function(){
	$("body").addClass("modal-open");
	$("#reportDownloads").addClass("enable");
});
$(".closereport").click(function(){
	$("#reportDownloads").removeClass("enable");
	$("body").removeClass("modal-open");
});
