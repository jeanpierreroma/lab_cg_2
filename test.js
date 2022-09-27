function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }
  
  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }
  
  $(document).ready(function () {
    $("#circle").click(function(){
      $("#input").val('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">\r\n  <circle cx="20" cy="20" r="20" fill="none" stroke="#aaa" stroke-width="2" />\r\n</svg>');
    });
  
    $("#use").click(function(){
      $("#input").val('<svg viewBox="0 0 96 64" width="96" height="64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\r\n  <defs>\r\n    <symbol id="c">\r\n      <path fill="inherit" d="M0 0v32h32V0H0zm24 9.6c1 0 2 1.4 1 2.4L15 22c-.6.5-1.4.5-2 0l-4-4c-1.2-1.3.7-3.2 2-2l3 3 9-9c.4-.3.7-.4 1-.4z"/>\r\n    </symbol>\r\n  </defs>\r\n  <use x="0" y="0" xlink:href="#c" fill="olive" />\r\n  <use x="32" y="0" xlink:href="#c" fill="green" />\r\n  <use x="64" y="0" xlink:href="#c" fill="forestgreen" />\r\n  <use x="0" y="32" xlink:href="#c" fill="seagreen" />\r\n  <use x="32" y="32" xlink:href="#c" fill="darkolivegreen" />\r\n  <use x="64" y="32" xlink:href="#c" fill="olivedrab" />\r\n</svg>');
    });
  
    $("#animate").click(function(){
      $("#input").val('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">\r\n<style type="text/css">\r\n  #c {animation: x 5s alternate infinite;}\r\n  @keyframes x { from { fill: gold; } to { fill: purple} }\r\n</style>\r\n<circle id="c" cx="20" cy="20" r="20" fill="gold"/>\r\n<!-- works in chrome ... not in IE and others -->\r\n</svg>');
    });
    
      $("#trans").click(function(){
      $("#input").val('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">\r\n    <path fill="#ddd" d="m0 0h16v32h16V16H0z" />\r\n</svg>');
    });
  
    $("#copy").click(function(){
      $("#output").focus();
      $("#output").select();
      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
      } catch (err) {
        console.log('Oops, unable to copy');
      }
    });
  
    // URIs as defined by RFC 3986 (see Section 2: Characters) 
    // may contain any of the following characters:
    // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=`.
  
    $("#convert").click(function(){
      var raw = $("#input").val();
      var encoded = raw.replace(/\s+/g, " ")
      
      // According to Taylor Hunt, lowercase gzips better ... my tiny test confirms this
      encoded = replaceAll(encoded, "%", "%25"); 
      encoded = replaceAll(encoded, "> <", "><"); // normalise spaces elements
      encoded = replaceAll(encoded, "; }", ";}"); // normalise spaces css
      encoded = replaceAll(encoded, "<", "%3c");
      encoded = replaceAll(encoded, ">", "%3e");
      encoded = replaceAll(encoded, "\"", "'");
      encoded = replaceAll(encoded, "#", "%23"); // needed for ie and firefox
      encoded = replaceAll(encoded, "{", "%7b");
      encoded = replaceAll(encoded, "}", "%7d");     
      encoded = replaceAll(encoded, "|", "%7c");
      encoded = replaceAll(encoded, "^", "%5e");
      encoded = replaceAll(encoded, "`", "%60"); 
      encoded = replaceAll(encoded, "@", "%40"); 
  
      // charset reportedly not needed ... I need to test before implementing
      var uri = 'url("data:image/svg+xml;charset=UTF-8,' + encoded + '")';
      var style = 'background-image: ' + uri + ';';
  
      $("#output").val(style);
      $("body").css( { "background-image": uri } );
      
      // TODO some positionining (preserveAspectRatio)
      $("body").css( { "background-color": $('#background-colour').val() } );
    });
  
    $('#background-colour').change(function(){
      $("body").css( 
        { "background-color": $('#background-colour').val() } );
    });
  });