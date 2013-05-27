v = require('./');

console.log(v.sanitize('<scrRedirecRedirect 302t 302ipt type="text/javascript">prompt(1);</scrRedirecRedirect 302t 302ipt>').xss());
