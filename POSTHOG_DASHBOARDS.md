# 📊 PostHog Dashboard Setup Guide

This guide outlines the recommended PostHog dashboards and insights for Mazunte Connect.

## 🎯 Core Dashboards

### 1. **User Engagement Dashboard**
**Purpose**: Track user activity and engagement metrics

**Key Metrics**:
- Daily/Monthly Active Users (DAU/MAU)
- Session duration and frequency
- Screen views per session
- User retention rates

**Events to Track**:
- `home_screen_viewed`
- `events_screen_viewed`
- `places_screen_viewed`
- `map_screen_viewed`
- `favorites_screen_viewed`

**Insights**:
- Funnel: User Journey (Home → Events → Event Detail)
- Cohort: User Retention by Signup Date
- Trends: Daily Active Users

### 2. **Feature Usage Dashboard**
**Purpose**: Monitor feature adoption and usage patterns

**Key Metrics**:
- Feature flag performance
- Create button usage
- Search functionality usage
- Map interaction rates

**Events to Track**:
- `create_screen_viewed`
- `events_searched`
- `places_searched`
- `map_event_marker_tapped`
- `map_place_marker_tapped`

**Insights**:
- Funnel: Event Creation Flow
- Funnel: Place Creation Flow
- Trends: Search Usage Over Time

### 3. **Content Performance Dashboard**
**Purpose**: Analyze content engagement and effectiveness

**Key Metrics**:
- Event view rates
- Place view rates
- Favorite actions
- Content discovery patterns

**Events to Track**:
- `event_detail_viewed`
- `place_detail_viewed`
- `favorite_event_tapped`
- `favorite_place_tapped`

**Insights**:
- Funnel: Content Discovery → Engagement
- Trends: Popular Event Categories
- Trends: Popular Place Types

### 4. **User Onboarding Dashboard**
**Purpose**: Track user onboarding success and drop-off points

**Key Metrics**:
- Onboarding completion rates
- Time to first event view
- Profile completion rates
- Settings usage

**Events to Track**:
- `user_signed_in`
- `profile_edit_viewed`
- `settings_screen_viewed`
- `language_changed`

**Insights**:
- Funnel: User Onboarding (Signup → Profile → First Event)
- Cohort: Onboarding Success Rate
- Trends: Time to First Action

### 5. **Performance Dashboard**
**Purpose**: Monitor app performance and technical metrics

**Key Metrics**:
- Screen load times
- Network request performance
- Error rates
- Memory usage

**Events to Track**:
- `$performance` events
- `$exception` events
- Network request metrics

**Insights**:
- Trends: Average Screen Load Time
- Trends: Error Rate Over Time
- Trends: Performance Metrics

## 🔧 Dashboard Configuration

### 1. **User Engagement Dashboard**
```json
{
  "name": "User Engagement",
  "widgets": [
    {
      "type": "trends",
      "query": {
        "events": ["home_screen_viewed"],
        "dateRange": "30d",
        "interval": "day"
      }
    },
    {
      "type": "funnel",
      "query": {
        "events": [
          "home_screen_viewed",
          "events_screen_viewed", 
          "event_detail_viewed"
        ]
      }
    }
  ]
}
```

### 2. **Feature Usage Dashboard**
```json
{
  "name": "Feature Usage",
  "widgets": [
    {
      "type": "trends",
      "query": {
        "events": ["create_screen_viewed"],
        "breakdown": "type"
      }
    },
    {
      "type": "funnel",
      "query": {
        "events": [
          "create_screen_viewed",
          "event_form_submitted",
          "event_published"
        ]
      }
    }
  ]
}
```

## 📈 Key Insights to Create

### 1. **User Journey Funnel**
- Home → Events → Event Detail → Favorite
- Home → Places → Place Detail → Favorite
- Create → Form → Submit → Publish

### 2. **Retention Analysis**
- Day 1, 7, 30 retention rates
- Cohort analysis by signup date
- Feature adoption over time

### 3. **Content Performance**
- Most viewed events/places
- Category performance
- Search query analysis

### 4. **Technical Performance**
- Screen load time trends
- Error rate monitoring
- Network performance

## 🎛️ Feature Flag Monitoring

### Flags to Monitor:
- `disable-event-creation`
- `disable-place-creation`
- `disable-drawer-menu`

### Metrics:
- Flag evaluation rates
- User behavior by flag variant
- Conversion rates by flag

## 📊 Custom Properties to Track

### User Properties:
- `app_version`
- `platform`
- `device_model`
- `language`
- `timezone`
- `user_type`
- `signup_source`

### Event Properties:
- `screen_name`
- `action_type`
- `content_category`
- `search_query`
- `filter_type`

## 🔍 Alerts to Set Up

### 1. **Critical Alerts**
- Error rate > 5%
- App crashes > 10 per hour
- Performance degradation > 50%

### 2. **Business Alerts**
- Daily active users drop > 20%
- Event creation rate drop > 30%
- Search success rate < 80%

## 📈 Reporting Schedule

### Daily Reports:
- User engagement metrics
- Error rates
- Performance metrics

### Weekly Reports:
- Feature usage trends
- User retention
- Content performance

### Monthly Reports:
- User growth
- Feature adoption
- Business metrics

## 🚀 Next Steps

1. **Set up dashboards** in PostHog
2. **Configure alerts** for critical metrics
3. **Create automated reports** for stakeholders
4. **Set up cohort analysis** for user retention
5. **Implement A/B testing** for key features
6. **Monitor feature flags** performance
7. **Track conversion funnels** for key user flows

## 📝 Dashboard Maintenance

### Weekly:
- Review error rates and performance
- Check feature flag performance
- Analyze user engagement trends

### Monthly:
- Update dashboard configurations
- Review and optimize queries
- Analyze long-term trends
- Update alert thresholds

### Quarterly:
- Comprehensive dashboard review
- Add new metrics based on business needs
- Optimize data collection
- Review and update reporting schedule
