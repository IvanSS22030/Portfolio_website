import { WorkExperience } from '../types';

export const experiences: WorkExperience[] = [
  {
    id: 1,
    company: "Thryv",
    position: "Data Engineer",
    period: "2025 - Present",
    description: "I design and maintain ETL pipelines and end-to-end automations with Python, Batch and UiPath for reporting, alerts and bulk data loads. I extract and validate Salesforce data with SOQL, keep databases clean and consistent, and build Power BI and SQL reports for leadership."
  },
  {
    id: 2,
    company: "SiriusXM",
    position: "Forecaster",
    period: "2024 - 2025",
    description: "I worked with predicting call volume and the migration of systems from LivePerson to AWS Amazon Connect. Created data pipelines to make forecasts and reports for the company."
  },
  {
    id: 3,
    company: "Verizon",
    position: "Workforce Scheduler",
    period: "2018 - 2024",
    description: "Created staffing reports, capacity planning, and mentored new employees in the workforce department. Supervised a small group of employees and created and optimized schedules for more than 800 employees across the United States and the Philippines."
  }
];