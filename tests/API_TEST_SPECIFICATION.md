# API Test Specification - Scan Endpoint

**Project**: MCP Playwright API Test Generator  
**Date Created**: April 9, 2026  
**Base URL**: http://127.0.0.1:6991

---

## Overview
This document outlines the comprehensive test cases for the API scan endpoint. Tests cover both GET and POST methods with detailed logging for debugging and validation.

---

## Endpoints Tested

### 1. GET / (Base Endpoint)
- **URL**: `http://127.0.0.1:6991/`
- **Method**: GET
- **Purpose**: Verify API is running and responsive

#### Tests:
- ✓ GET / - Should return 200 status code
- ✓ GET / - Should have valid headers

---

### 2. POST /api/scan (Scan Configuration Endpoint)
- **URL**: `http://127.0.0.1:6991/api/scan`
- **Method**: POST
- **Content-Type**: `application/json`
- **Purpose**: Submit scan configurations

---

## Request Schema

### Valid Payload Example
```json
{
  "color_mode": "Color",
  "auto_scan": true,
  "page_size": "A4",
  "page_orientation": "Portrait",
  "dpi": 300,
  "resolution": 300,
  "file_format": "PDF"
}
```

### Field Descriptions

| Field | Type | Values | Default | Required |
|-------|------|--------|---------|----------|
| `color_mode` | String | "Color", "Grayscale", "BlackAndWhite" | "Color" | ✓ |
| `auto_scan` | Boolean | true, false | true | ✓ |
| `page_size` | String | "A3", "A4", "A5", "Letter", "Legal" | "A4" | ✓ |
| `page_orientation` | String | "Portrait", "Landscape" | "Portrait" | ✓ |
| `dpi` | Integer | 50-1200 | 300 | ✓ |
| `resolution` | Integer | 50-1200 | 300 | ✓ |
| `file_format` | String | "PDF", "JPEG", "PNG", "TIFF", "BMP" | "PDF" | ✓ |

---

## Test Cases

### Category 1: Basic Connectivity Tests

#### TC-001: Base Endpoint Availability
- **Description**: Verify the API base endpoint is accessible
- **Expected Result**: Status code < 500
- **Logs Captured**: 
  - Request timestamp
  - Status code
  - Response headers
  - Response body (first 500 chars)

#### TC-002: Header Validation
- **Description**: Verify response headers are properly set
- **Expected Result**: Content-Type header present
- **Logs Captured**:
  - All response headers
  - Header validation status

---

### Category 2: Valid Payload Tests

#### TC-003: Accept Valid Scan Configuration
- **Description**: POST with all required fields in valid format
- **Payload**: Standard valid payload (see above)
- **Expected Result**: Status code in [200, 201, 202, 400, 422]
- **Logs Captured**:
  - Request payload
  - Status code
  - Response body
  - Validation status

---

### Category 3: Field Validation Tests

#### TC-004: Required Fields Validation
- **Description**: Submit payload with only one field (color_mode)
- **Expected Result**: Either accepted or returns 400/422 error
- **Logs Captured**:
  - Incomplete payload
  - Status code
  - Validation response

#### TC-005: Invalid Values Handling
- **Description**: POST with invalid values for all fields
- **Examples**:
  - color_mode: "InvalidColor"
  - auto_scan: "not_a_boolean"
  - page_size: "Invalid"
  - dpi: -100
  - resolution: "invalid"
  - file_format: "INVALID"
- **Expected Result**: Status code in [200, 201, 202, 400, 422]
- **Logs Captured**:
  - Invalid payload
  - Status code
  - Error details

---

### Category 4: Parameter Variation Tests

#### TC-006: DPI Variations Test
- **Description**: Test multiple valid DPI values
- **Tested Values**: 50, 100, 200, 300, 600, 1200
- **Expected Result**: Each DPI variation handled appropriately
- **Logs Captured**:
  - Status per DPI value
  - Any errors encountered

#### TC-007: File Format Variations Test
- **Description**: Test different file format outputs
- **Tested Formats**: PDF, JPEG, PNG, TIFF, BMP
- **Expected Result**: Each format accepted or validated
- **Logs Captured**:
  - Status per format
  - Format compatibility notes

#### TC-008: Page Size Variations Test
- **Description**: Test different page sizes
- **Tested Sizes**: A3, A4, A5, Letter, Legal
- **Expected Result**: Each size handled appropriately
- **Logs Captured**:
  - Status per page size
  - Support confirmation

#### TC-009: Color Mode Validation Test
- **Description**: Test different color modes
- **Tested Modes**: Color, Grayscale, BlackAndWhite
- **Expected Result**: Each color mode supported
- **Logs Captured**:
  - Status per color mode
  - Mode support confirmation

---

### Category 5: Performance Tests

#### TC-010: Response Time Performance Check
- **Description**: Measure and validate API response time
- **Requirement**: Response time < 5000ms
- **Logs Captured**:
  - Start time (ISO format)
  - End time (ISO format)
  - Response time (milliseconds)
  - Status code
  - Pass/Fail status

---

### Category 6: Error Scenario Tests

#### TC-011: Connection Error Handling
- **Description**: Attempt connection to unreachable endpoint
- **Expected Result**: Graceful error handling
- **Logs Captured**:
  - Connection attempt
  - Error type
  - Error handling status

#### TC-012: Malformed JSON Handling
- **Description**: Send improperly formatted JSON
- **Payload**: `{ invalid json }`
- **Expected Result**: Status code in [400, 422, 500] or request rejected
- **Logs Captured**:
  - Malformed payload
  - Status code or error
  - Rejection confirmation

---

## Debug Logging Format

All tests include comprehensive Debug logging with emoji indicators:

| Icon | Meaning |
|------|---------|
| 📍 | Test identifier/section |
| ✅ | Success or successful capture |
| ❌ | Error or failure |
| 📤 | Request payload/data being sent |
| 📝 | Response body/data received |
| 📋 | Headers information |
| ⏱️ | Time-related information |
| ✓ | Test passed verification |

---

## Running the Tests

### Run All API Tests
```bash
npm test
```

### Run Only Scan Endpoint Tests
```bash
npm test api-scan.spec.ts
```

### Run with UI Mode
```bash
npm test:ui
```

### Run with Debug Mode
```bash
npm test:debug
```

### View HTML Report
```bash
npm test:report
```

---

## Test Execution Environment

- **Framework**: Playwright v1.59.1
- **Language**: TypeScript
- **Test Runner**: Playwright Test
- **Reporters**: HTML Report (default)
- **Base URL**: http://127.0.0.1:6991
- **Request Context**: Playwright API Request Context

---

## Expected Test Output

### Console Output Example
```
📍 TEST: GET http://127.0.0.1:6991/
⏱️ Request Time: 2026-04-09T10:30:45.123Z
✅ Status Code: 200
📋 Response Headers: { content-type: 'application/json', ...}
📝 Response Body:
{ "message": "API is running", ...}
✓ Test passed: Server is responsive
```

---

## Report Generation

After test execution, detailed HTML reports are generated at:
- **Location**: `./playwright-report/index.html`
- **Contents**:
  - Test results summary
  - Pass/fail statistics
  - Detailed test logs
  - Timing information
  - Screenshots (if configured)

---

## Error Scenarios Covered

1. ✓ Incomplete payloads (missing fields)
2. ✓ Invalid field values
3. ✓ Wrong data types
4. ✓ Negative numeric values
5. ✓ Malformed JSON
6. ✓ Connection failures
7. ✓ Invalid enum values
8. ✓ Special characters in strings
9. ✓ Performance degradation
10. ✓ Server unavailability

---

## Next Steps & Enhancements

- [ ] Add authentication tests (API key, OAuth, etc.)
- [ ] Add rate limiting tests
- [ ] Add concurrent request tests
- [ ] Add baseline/regression testing
- [ ] Add response schema validation (JSON Schema)
- [ ] Add database state verification
- [ ] Add mock server for offline testing
- [ ] Add CI/CD integration

---

## Notes

- All tests include detailed console logging for debugging
- Tests are independent and can run in parallel
- Connection timeouts: Default Playwright timeout
- Response validation includes both positive and negative scenarios
- Performance baseline: 5000ms max response time

---

**Test File Location**: `tests/api-scan.spec.ts`  
**Last Updated**: April 9, 2026
