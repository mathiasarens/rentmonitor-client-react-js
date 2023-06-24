# AWS Amplify
The project is managed in AWS Amplify

https://rentmonitor-deveu.mathias-arens.de/

Amplify URL rewrite
```
[
    {
        "source": "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>",
        "target": "/index.html",
        "status": "200",
        "condition": null
    }
]
```
