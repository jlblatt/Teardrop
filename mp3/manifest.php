<?php

//if the user doesn't have PHP installed parsing this file will trigger an error in client

$dir = '';

if(file_exists("manifest.json")) {

  //if we've already generted a manifest, just use that

  echo file_get_contents("manifest.json");

} else if($dir) {

  //otherwise create one and serve it to the client

  $Directory = new RecursiveDirectoryIterator($dir);
  $Iterator = new RecursiveIteratorIterator($Directory);

  $Regex = new RegexIterator($Iterator, '/^.+\.mp3$/i', RecursiveRegexIterator::GET_MATCH);
  $Manifest = array_keys(iterator_to_array($Regex));

  $json = json_encode($Manifest);
  file_put_contents("manifest.json", $json);
  echo $json;

} else {

  //user hasn't specified a root directory to generate manifest
  //purposefully return malformed JSON to trigger an error in client
  
  echo 'error';

}

?>