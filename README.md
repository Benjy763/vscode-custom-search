# custom-search

Create a personalized report of your research. You can specify a list of search te execute with specific files types and pattern to find into them.
Personalise the output search results.

## Installation
Download the zip file from latest release and unzip it in our ".vscode/extensions" folder.

## Launch
Into vscode use ctrl+maj+p and tip

    generate search report

## Configuration

Create a custom-search.json in your root folder and customize it, ex:
```javascript
{
  "filesPatterns": [
    { "type": "AngularJS controllers", "filesPattern": "**/*.module.js", "annotationPattern": ".controller\\(" },
    { "type": "AngularJS Components", "filesPattern": "**/*.module.js", "annotationPattern": ".component\\(" },
    { "type": "AngularJS Services", "filesPattern": "**/*.module.js", "annotationPattern": ".service\\(|.factory\\(" },
    { "type": "AngularJS directives", "filesPattern": "**/*.module.js", "annotationPattern": ".directive\\(" },
    { "type": "JS files", "filesPattern": "**/*.js" },
    { "type": "Angular components", "filesPattern": "**/*.ts", "annotationPattern": "@Component\\(" },
    { "type": "Angular services", "filesPattern": "**/*.ts", "annotationPattern": "@Injectable\\(" },
    { "type": "TS files", "filesPattern": "**/*.ts" }
  ],
  "exclusionPatterns": "{node_modules,**/*.mock.ts}"
}
```
