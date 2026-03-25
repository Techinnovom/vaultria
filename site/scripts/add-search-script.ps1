$root = Join-Path $PSScriptRoot ".."
Get-ChildItem -Path $root -Recurse -Filter "*.html" | ForEach-Object {
  $c = [IO.File]::ReadAllText($_.FullName)
  if ($c -match "site-nav\.js" -and $c -notmatch "site-search\.js") {
    $add = if ($_.Name -eq "index.html") {
      "  <script src=`"assets/js/site-search.js`" defer></script>"
    } else {
      "  <script src=`"../assets/js/site-search.js`" defer></script>"
    }
    $nl = [Environment]::NewLine
    $old = [regex]::Match($c, '<script src="[^"]*site-nav\.js" defer></script>')
    if ($old.Success) {
      $c2 = $c.Substring(0, $old.Index) + $old.Value + $nl + $add + $c.Substring($old.Index + $old.Length)
      [IO.File]::WriteAllText($_.FullName, $c2)
      Write-Host "updated: $($_.FullName)"
    }
  }
}
