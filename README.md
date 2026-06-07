# MottaFit - Complete Gym & Personal Training Management System

## 🏋️ About

MottaFit is a full-stack gym management platform built with **.NET 8 Lambda API** and **React TypeScript**. It gives personal trainers a single place to manage students, workouts, classes, payments, and body assessments — all accessible from any device.

## 🚀 Features

### 👨‍🏫 Trainer
- ✅ **Authentication** — Secure login with JWT
- ✅ **Registration** — Self-registration for trainers
- ✅ **Exercise Management** — Full CRUD across 8 muscle categories
- ✅ **Workout Builder** — Personalised weekly training plans
- ✅ **Student Management** — Invite-based onboarding and management
- ✅ **Class Calendar** — Schedule classes and track attendance status
- ✅ **Financial Control** — Payment tracking and monthly reports
- ✅ **Body Composition** — Scientific bioimpedance assessments
- ✅ **Load History** — Automatic progression tracking

### 👨‍🎓 Student
- ✅ **Invite Registration** — Sign up via trainer's invitation link
- ✅ **Secure Login** — JWT-based authentication
- ✅ **Personalised Workouts** — View weekly training plans
- ✅ **Exercise Details** — Full instructions and video references
- ✅ **Load History** — Track personal progression over time
- ✅ **Body Assessments** — View bioimpedance results and evolution

### 🏃‍♂️ Exercises
- ✅ **8 Categories** — Chest, Back, Shoulders, Biceps, Triceps, Legs, Core, Cardio
- ✅ **Full Details** — Sets, reps, load, and video reference per exercise
- ✅ **Trainer-only Management** — Students have read-only access

### 📋 Workouts
- ✅ **Weekly Structure** — Organised by day of the week
- ✅ **Per-student Parameters** — Custom sets, reps, and load per student
- ✅ **Load Tracking** — Automatic progression history
- ✅ **Exercise Notes** — Trainer observations per exercise

### 📅 Class Scheduling
- ✅ **Visual Calendar** — Multiple views (week/day/month)
- ✅ **Flexible Scheduling** — Single or recurring classes
- ✅ **Attendance Status** — Scheduled, Completed, Missed, Rescheduled
- ✅ **Rescheduling** — Full reschedule flow with history
- ✅ **Mobile Responsive** — Optimised for smartphone use

### 💰 Financial Management
- ✅ **Per-student Pricing** — Individual rate configuration
- ✅ **Automatic Billing** — Based on completed or missed classes
- ✅ **Payment Tracking** — Log and confirm received payments
- ✅ **Monthly Reports** — Detailed revenue analysis
- ✅ **Payment Methods** — PIX, Cash, Credit/Debit Card

### 🔬 Body Composition (Bioimpedance)
- ✅ **Scientific Formulas** — Kyle et al. and Harris-Benedict equations
- ✅ **Full Body Analysis** — BMI, body fat %, lean mass, BMR
- ✅ **Progress Comparison** — Side-by-side assessment history
- ✅ **Anthropometric Data** — Circumferences and skinfold measurements
- ✅ **Detailed Reports** — Comprehensive result visualisation

## 🛠️ Tech Stack

### Backend
- **.NET 8** — Core framework
- **AWS Lambda** — Serverless compute
- **AWS DynamoDB** — NoSQL database
- **JWT Bearer** — Stateless authentication
- **BCrypt** — Password hashing

### Frontend
- **React 18** — UI framework
- **TypeScript** — Static typing
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icon library
- **Axios** — HTTP client

### Infrastructure
- **AWS API Gateway** — API management and routing
- **GitHub Actions** — CI/CD pipeline
- **AWS IAM** — Access control
- **Region** — SA-East-1 (São Paulo)

## 📊 Database Structure (DynamoDB)

| Table | Description |
|---|---|
| `Trainers` | Trainer profiles and credentials |
| `Students` | Student data and associations |
| `Invites` | Invite token management |
| `Exercises` | Exercise catalogue |
| `Workouts` | Personalised training plans |
| `Classes` | Scheduled sessions and attendance |
| `Payments` | Financial records |
| `Bioimpedance` | Body composition assessments |
| `LoadHistory` | Weight/rep progression tracking |

## ⚙️ Configuration

### AWS Credentials
```json
{
  "AWS": {
    "Region": "sa-east-1",
    "AccessKey": "your_access_key",
    "SecretKey": "your_secret_key"
  }
}
```

### JWT Configuration
```json
{
  "Jwt": {
    "Key": "your-secret-jwt-key-minimum-32-characters",
    "Issuer": "MottaFit.Api",
    "Audience": "MottaFit.Client"
  }
}
```

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login/trainer` | Trainer login |
| POST | `/api/auth/login/student` | Student login |
| POST | `/api/trainer/register` | Trainer registration |

### Exercises
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/exercise/list` | List all exercises |
| POST | `/api/exercise/create` | Create exercise |
| PUT | `/api/exercise/update/{id}` | Update exercise |

### Workouts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workout` | List workouts |
| POST | `/api/workout` | Create workout |
| PUT | `/api/workout/{id}/load` | Update load data |

### Classes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/class/list` | List classes |
| POST | `/api/class/create` | Schedule a class |
| PUT | `/api/class/status/{id}` | Update class status |

### Financial
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/student/financial-report` | Monthly financial report |
| POST | `/api/student/confirm-payment` | Confirm payment received |

### Body Composition
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bioimpedance/create` | Create assessment |
| GET | `/api/bioimpedance/compare/{studentId}` | Compare assessments |

## 📁 Project Structure

```
MottaFit/
├── MottaFit.Api/                 # .NET 8 Lambda Backend
│   ├── Controllers/              # API route handlers
│   ├── Services/                 # Business logic layer
│   ├── Models/                   # Domain models
│   ├── DTOs/                     # Data Transfer Objects
│   └── Helpers/                  # Utility classes
├── web/                          # React TypeScript Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Application pages
│   │   ├── services/             # API integration layer
│   │   ├── contexts/             # React context providers
│   │   └── types/                # TypeScript type definitions
│   └── public/                   # Static assets
└── .github/workflows/            # CI/CD pipeline definitions
```

## 🎯 Usage Flow

### Trainer Journey
1. **Register / Login** → Access the dashboard
2. **Build Exercise Library** → Create a personalised catalogue
3. **Invite Students** → Send registration links
4. **Create Workouts** → Assign weekly plans per student
5. **Schedule Classes** → Manage the training calendar
6. **Track Payments** → Monitor revenue and outstanding amounts
7. **Run Assessments** → Record and compare body composition

### Student Journey
1. **Register via Invite** → Sign up through trainer's link
2. **Login** → Access personal dashboard
3. **View Workouts** → See weekly training plan
4. **Log Progress** → Record weights and reps
5. **Track Results** → View body composition history

## 🔒 Security

- ✅ **Password Hashing** — BCrypt with salt
- ✅ **JWT Tokens** — 24h expiry with refresh flow
- ✅ **Role-Based Auth** — Trainer vs Student access levels
- ✅ **Resource Ownership** — Users can only access their own data
- ✅ **CORS Policy** — Configured per environment
- ✅ **HTTPS Only** — All traffic encrypted in transit

## 📱 Responsive Design

- ✅ **Mobile First** — Designed for smartphone use from the ground up
- ✅ **Touch Friendly** — All interactive elements ≥ 44px
- ✅ **Adaptive Calendar** — Auto-switches to daily view on mobile
- ✅ **Adaptive Forms** — Optimised input types per device
- ✅ **Intuitive Navigation** — Simplified UX for on-the-go use

## 🚀 CI/CD & Deployment

- ✅ **GitHub Actions** — Automated build and deploy pipeline
- ✅ **AWS Lambda** — Zero-downtime serverless deployments
- ✅ **Production Environment** — SA-East-1 (São Paulo)
- ✅ **Automatic Rollback** — Reverts on failed deployments

## 📈 Scientific Calculations

**Body Composition:**
- Bioimpedance analysis using Kyle et al. formulas
- Basal Metabolic Rate via Harris-Benedict equation
- Full body composition breakdown (fat mass, lean mass, BMI)
- Automatic load progression tracking

**Financial Analytics:**
- Monthly revenue (received vs pending)
- Per-student performance breakdown
- Payment method distribution

## 🔄 Roadmap

- 📊 **Analytics Dashboard** — Advanced performance metrics
- 📱 **Native Mobile App** — iOS & Android
- 🔔 **Push Notifications** — Class reminders and alerts
- 📈 **Advanced Reports** — Predictive analytics
- 🎯 **Goals & Milestones** — Gamification layer

---

**MottaFit** — Professional management platform for gyms and personal trainers 💪

**Version:** 1.0.0 — Phase 1 Complete &nbsp;|&nbsp; **Region:** AWS SA-East-1 &nbsp;|&nbsp; **Status:** Production ✅
