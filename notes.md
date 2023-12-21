### Qodana Setup
- #### Requirements:
```yml
    - Docker
```
- #### Setup
```bash
    curl -fsSL https://jb.gg/qodana-cli/install | bash -s -- v2023.1.6 /home/luis/.local/bin
```
```bash
    qodana init
```
```bash
    qodana scan --show-report
```