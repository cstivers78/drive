FORMAT_PARAMETER_PATTERN = /\@\(([a-zA-Z](?:[a-zA-Z0-9_]*))\)/g

String::format = (parameters) -> 
  value = this.valueOf()
  value.replace FORMAT_PARAMETER_PATTERN, (match,name) -> parameters?[name] ? "<>"
