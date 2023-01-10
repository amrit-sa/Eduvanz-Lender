// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable({
"bSort" : false,
"searching": false,
"bInfo" : false,
"bLengthChange": false,
"pagingType": "simple_numbers",
"pageLength": 7,
language: {
    paginate: {
      next: '&#8594;', // or '→'
      previous: '&#8592;' // or '←' 
    }
  }
});
});
