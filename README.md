# Financial Operations Engine

Distributed financial operations engine with transaction control, dynamic rates, and master ledger consolidation.

---

## 🧠 Overview

This project implements a financial operations management system designed to handle multi-operator environments with high data integrity requirements.

It provides controlled workflows for registering, approving, and consolidating financial transactions into a centralized master ledger.

---

## 🎯 Problem

Organizations managing financial operations across multiple operators often face:

- Inconsistent balances  
- Lack of control over data modifications  
- Errors in applied exchange rates  
- Difficulty consolidating transactions  
- No auditability of changes  

---

## 🚀 Solution

This system introduces a structured and controlled flow:

1. Transaction registration (operator level)  
2. Validation and approval process  
3. Automatic balance calculation  
4. Consolidation into a master ledger  
5. Logical locking of finalized records  

---

## ⚙️ Key Features

- ✔ Transaction state control (Pending, Approved, Verified, Closed)  
- ✔ Real-time balance calculation per counterparty  
- ✔ Dynamic rate management with validity ranges  
- ✔ Master ledger consolidation  
- ✔ Logical data protection (no destructive edits)  
- ✔ Unique global transaction ID system  
- ✔ API-based validation (API KEY per operator)  

---

## 🧩 System Architecture
Operator Sheet → WebApp → Processing Engine → Master Ledger


### Core Components:

- **Operator Books**: Transaction input layer  
- **WebApp (Apps Script)**: Interface and validation  
- **Processing Engine**:
  - Business rules enforcement  
  - Rate application  
  - Balance calculation  
  - Concurrency control (LockService)  
- **Master Ledger**:
  - Centralized, immutable transaction history  

---

## 🔒 Data Integrity Design

- Sequential balance calculation per counterparty  
- LockService to prevent concurrent inconsistencies  
- Immutable approved records (no deletion)  
- Historical rate preservation  
- Controlled state transitions  

---

## 🛠️ Tech Stack

- Google Apps Script  
- Google Sheets  
- HTML / CSS / JavaScript  

---

## 📊 Use Cases

- Currency exchange operations  
- Multi-cashier financial control  
- Third-party balance tracking  
- Operational accounting systems  

---

## 📌 Project Status

🚧 In active development  

Planned improvements:

- [ ] Advanced audit logging  
- [ ] External API layer  
- [ ] Real-time dashboard  
- [ ] Multi-company support  
- [ ] Automated reversal transactions  

---

## 👨‍💻 Author

Developed as a custom financial operations system focused on data consistency, operational control, and scalability using lightweight architecture.

---

## 📄 License

MIT License

---

# 🇪🇸 Versión en Español

## 🧠 Descripción General

Este proyecto implementa un sistema de gestión de operaciones financieras diseñado para entornos con múltiples operadores y altos requerimientos de integridad de datos.

Permite registrar, validar y consolidar transacciones en un libro maestro centralizado mediante flujos controlados.

---

## 🎯 Problema

Las organizaciones que manejan operaciones financieras con múltiples usuarios suelen enfrentar:

- Inconsistencias en saldos  
- Falta de control sobre modificaciones  
- Errores en tasas aplicadas  
- Dificultad para consolidar información  
- Falta de trazabilidad  

---

## 🚀 Solución

El sistema implementa un flujo estructurado:

1. Registro de operaciones  
2. Validación y aprobación  
3. Cálculo automático de saldos  
4. Consolidación en libro maestro  
5. Bloqueo lógico de registros finalizados  

---

## ⚙️ Funcionalidades Clave

- ✔ Control de estados (Pendiente, Aprobado, Verificado, Cerrado)  
- ✔ Cálculo de saldos por contraparte en tiempo real  
- ✔ Manejo de tasas con vigencia  
- ✔ Consolidación en libro maestro  
- ✔ Protección lógica de datos (sin eliminaciones)  
- ✔ Sistema de ID único global  
- ✔ Validación mediante API KEY por operador  

---

## 🧩 Arquitectura del Sistema
Libro Operador → WebApp → Motor de Procesamiento → Libro Madre

### Componentes:

- **Libros Operadores**: Entrada de datos  
- **WebApp (Apps Script)**: Interfaz y validaciones  
- **Motor de Procesamiento**:
  - Reglas de negocio  
  - Aplicación de tasas  
  - Cálculo de saldos  
  - Control de concurrencia (LockService)  
- **Libro Madre**:
  - Historial centralizado e inmutable  

---

## 🔒 Integridad de Datos

- Cálculo secuencial de saldos  
- Prevención de concurrencia con LockService  
- Registros aprobados no eliminables  
- Preservación histórica de tasas  
- Control estricto de estados  

---

## 🛠️ Tecnologías

- Google Apps Script  
- Google Sheets  
- HTML / CSS / JavaScript  

---

## 📊 Casos de Uso

- Casas de cambio  
- Control de múltiples cajeros  
- Gestión de saldos por terceros  
- Sistemas contables operativos  

---

## 📌 Estado del Proyecto

🚧 En desarrollo activo  

Mejoras planeadas:

- [ ] Auditoría avanzada  
- [ ] API externa  
- [ ] Dashboard en tiempo real  
- [ ] Soporte multiempresa  
- [ ] Transacciones reversibles automáticas  

---

## 👨‍💻 Autor

Sistema desarrollado con enfoque en control operativo, consistencia de datos y escalabilidad usando arquitectura ligera.
