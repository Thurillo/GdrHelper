# Fix Server Deployment and SSH

The goal is to resolve the `package-lock.json` conflict on the remote server and ensure that the agent can connect autonomously via SSH.

## Proposed Changes

### Remote Server Fix (Manual Copy-Paste)
The user needs to run a command to reset the local changes and pull the new deployment script.

```bash
cd /opt/GdrHelper && git checkout -- package-lock.json && git pull origin main && chmod +x deploy.sh && ./deploy.sh
```

### SSH Troubleshooting
We will ask the user to verify the `authorized_keys` permissions and the `sshd_config` settings.

1. Verify permissions: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`
2. Check `sshd_config`: Ensure `PubkeyAuthentication yes` is set and not commented out.

## Verification Plan

### Manual Verification
- User confirms the command succeeds and the server is updated.
- User confirms the output of `http://192.168.1.37:3000/api/seed-races`.
- Agent attempts to SSH again to verify access.
