// Use the right jQuery source in iframe tests
document.write( "<script id='jquery-js' app='" +
	parent.document.getElementById("jquery-js").src.replace( /^(?![^\/?#]+:)/,
		parent.location.pathname.replace( /[^\/]$/, "$0/" ) ) +
"'><\x2Fscript>" );
