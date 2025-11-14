# 🚀 Pre-deploy Command no Railway

## ✅ O que colocar no Pre-deploy Command

No Railway Dashboard, vá em:
1. Seu serviço **backend**
2. **Settings** → **Deploy**
3. Procure por **"Pre-deploy Command"** ou **"Pre Deploy"**
4. Adicione:

```bash
npx prisma migrate deploy
```

## 📝 Por que isso é importante?

O Pre-deploy Command executa **ANTES** do container iniciar, garantindo que:
- ✅ As migrations sejam aplicadas antes do servidor iniciar
- ✅ Se as migrations falharem, o deploy não completa
- ✅ Você vê erros de migrations antes do servidor tentar iniciar

## 🔄 Fluxo Completo Agora

1. **Build**: Compila o código TypeScript
2. **Pre-deploy**: Aplica migrations (`npx prisma migrate deploy`)
3. **Start**: Inicia o servidor (que também verifica migrations como backup)

Isso cria uma **dupla proteção**:
- Pre-deploy garante migrations antes do deploy
- server.ts garante migrations antes de iniciar (backup)

## ⚠️ Importante

Se você colocar o Pre-deploy Command, o Railway vai:
- Executar `npx prisma migrate deploy` ANTES de iniciar o container
- Se falhar, o deploy não completa
- Você vê o erro nos logs do deploy

## 🎯 Comando Exato para Copiar

```
npx prisma migrate deploy
```

Simples assim! Copie e cole no campo "Pre-deploy Command" no Railway.

