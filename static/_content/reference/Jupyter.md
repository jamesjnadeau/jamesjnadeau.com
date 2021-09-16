---
title: Jupyter Notes
description: This description will go in the meta description tag

Date: 04/13/2020
---
# Jupyter

A space to store stuff about Jupyter that I'll most likely use again.

## Jupyter Lab Keyboard Shortcuts

```json
{
    "shortcuts": [
        {
            "command": "notebook:restart-run-all",
            "keys": [
              "Ctrl Shift Enter"
            ],
            "selector": "body"
        },
        {
            "command": "notebook:run-all-above",
            "keys": [
              "Ctrl Alt ArrowUp"
            ],
            "selector": "body"
        },
        {
            "command": "notebook:run-all-below",
            "keys": [
              "Ctrl Alt ArrowDown"
            ],
            "selector": "body"
        },
    ]
}
```

## Jupyter Notbook config

```json
{ 
    "codeCellConfig": { 
        "autoClosingBrackets": true,
        "lineNumbers": true,
        "lineWrap": "on", 
    },
    "kernelShutdown": true,
}
```
