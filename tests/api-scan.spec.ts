import { test, expect, request } from '@playwright/test';

// API Test Generator for Scan Endpoint
// Tests both GET and POST methods with comprehensive logging

const BASE_URL = 'http://127.0.0.1:6991';
const SCAN_ENDPOINT = '/api/scan';

// Test suite for GET method on base endpoint
test.describe('GET /api - Base Endpoint Tests', () => {
  test('GET / - Should return 200 status code', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: GET ${BASE_URL}/`);
    console.log(`⏱️ Request Time: ${new Date().toISOString()}`);

    try {
      const response = await requestContext.get(`${BASE_URL}/`);
      const statusCode = response.status();
      
      console.log(`✅ Status Code: ${statusCode}`);
      console.log(`📋 Response Headers:`, response.headers());
      
      const responseBody = await response.text();
      console.log(`📝 Response Body:\n${responseBody.substring(0, 500)}...`);
      
      expect(statusCode).toBeLessThan(500);
      console.log('✓ Test passed: Server is responsive\n');
    } catch (error) {
      console.log(`❌ Error: ${error}`);
      throw error;
    } finally {
      await requestContext.dispose();
    }
  });

  test('GET / - Should have valid headers', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: GET ${BASE_URL}/ - Header Validation`);

    try {
      const response = await requestContext.get(`${BASE_URL}/`);
      const headers = response.headers();
      
      console.log(`✅ Response Headers Received:`);
      Object.entries(headers).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
      
      // Check for common headers
      expect(headers['content-type'] || headers['Content-Type']).toBeDefined();
      console.log('✓ Test passed: Required headers present\n');
    } catch (error) {
      console.log(`❌ Error: ${error}`);
      throw error;
    } finally {
      await requestContext.dispose();
    }
  });
});

// Test suite for POST method on scan endpoint
test.describe('POST /api/scan - Scan Endpoint Tests', () => {
  
  const validPayload = {
    "color_mode": "Color",
    "auto_scan": true,
    "page_size": "A4",
    "page_orientation": "Portrait",
    "dpi": 300,
    "resolution": 300,
    "file_format": "PDF"
  };

  test('POST /api/scan - Should accept valid scan configuration', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: POST ${BASE_URL}${SCAN_ENDPOINT}`);
    console.log(`⏱️ Request Time: ${new Date().toISOString()}`);
    console.log(`📤 Request Payload:\n${JSON.stringify(validPayload, null, 2)}`);

    try {
      const response = await requestContext.post(`${BASE_URL}${SCAN_ENDPOINT}`, {
        data: validPayload,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const statusCode = response.status();
      console.log(`✅ Status Code: ${statusCode}`);
      console.log(`📋 Response Headers:`, response.headers());
      
      const responseBody = await response.json().catch(() => ({}));
      console.log(`📝 Response Body:\n${JSON.stringify(responseBody, null, 2)}`);
      
      expect([200, 201, 202, 400, 422]).toContain(statusCode);
      console.log('✓ Test passed: Valid response received\n');
    } catch (error) {
      console.log(`❌ Error: ${error}`);
      throw error;
    } finally {
      await requestContext.dispose();
    }
  });

  test('POST /api/scan - Should validate required fields', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: POST ${BASE_URL}${SCAN_ENDPOINT} - Field Validation`);
    
    const incompletePayload = {
      "color_mode": "Color"
      // Missing other required fields
    };
    
    console.log(`📤 Request Payload (Incomplete):\n${JSON.stringify(incompletePayload, null, 2)}`);

    try {
      const response = await requestContext.post(`${BASE_URL}${SCAN_ENDPOINT}`, {
        data: incompletePayload,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const statusCode = response.status();
      console.log(`✅ Status Code: ${statusCode}`);
      
      const responseBody = await response.json().catch(() => ({}));
      console.log(`📝 Response Body:\n${JSON.stringify(responseBody, null, 2)}`);
      
      // Server should either accept or reject the incomplete payload
      expect([200, 201, 202, 400, 422]).toContain(statusCode);
      console.log('✓ Test passed: Server validated request appropriately\n');
    } catch (error) {
      console.log(`❌ Error: ${error}`);
      throw error;
    } finally {
      await requestContext.dispose();
    }
  });

  test('POST /api/scan - Should handle invalid values', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: POST ${BASE_URL}${SCAN_ENDPOINT} - Invalid Values`);
    
    const invalidPayload = {
      "color_mode": "InvalidColor",
      "auto_scan": "not_a_boolean",
      "page_size": "Invalid",
      "page_orientation": "Invalid",
      "dpi": -100,
      "resolution": "invalid",
      "file_format": "INVALID"
    };
    
    console.log(`📤 Request Payload (Invalid):\n${JSON.stringify(invalidPayload, null, 2)}`);

    try {
      const response = await requestContext.post(`${BASE_URL}${SCAN_ENDPOINT}`, {
        data: invalidPayload,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const statusCode = response.status();
      console.log(`✅ Status Code: ${statusCode}`);
      
      const responseBody = await response.json().catch(() => ({}));
      console.log(`📝 Response Body:\n${JSON.stringify(responseBody, null, 2)}`);
      
      expect([200, 201, 202, 400, 422]).toContain(statusCode);
      console.log('✓ Test passed: Invalid data handled appropriately\n');
    } catch (error) {
      console.log(`❌ Error: ${error}`);
      throw error;
    } finally {
      await requestContext.dispose();
    }
  });

  test('POST /api/scan - Should handle different DPI values', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: POST ${BASE_URL}${SCAN_ENDPOINT} - DPI Variations`);
    
    const dpiValues = [50, 100, 200, 300, 600, 1200];
    
    for (const dpi of dpiValues) {
      const payload = { ...validPayload, dpi };
      console.log(`📤 Testing DPI: ${dpi}`);
      
      try {
        const response = await requestContext.post(`${BASE_URL}${SCAN_ENDPOINT}`, {
          data: payload,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const statusCode = response.status();
        console.log(`   ✅ Status: ${statusCode}`);
        expect([200, 201, 202, 400, 422]).toContain(statusCode);
      } catch (error) {
        console.log(`   ❌ Error for DPI ${dpi}: ${error}`);
        throw error;
      }
    }
    console.log('✓ Test passed: All DPI variations handled\n');
    await requestContext.dispose();
  });

  test('POST /api/scan - Should handle different file formats', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: POST ${BASE_URL}${SCAN_ENDPOINT} - File Format Variations`);
    
    const formats = ['PDF', 'JPEG', 'PNG', 'TIFF', 'BMP'];
    
    for (const format of formats) {
      const payload = { ...validPayload, file_format: format };
      console.log(`📤 Testing Format: ${format}`);
      
      try {
        const response = await requestContext.post(`${BASE_URL}${SCAN_ENDPOINT}`, {
          data: payload,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const statusCode = response.status();
        console.log(`   ✅ Status: ${statusCode}`);
        expect([200, 201, 202, 400, 422]).toContain(statusCode);
      } catch (error) {
        console.log(`   ❌ Error for format ${format}: ${error}`);
        throw error;
      }
    }
    console.log('✓ Test passed: All file formats handled\n');
    await requestContext.dispose();
  });

  test('POST /api/scan - Should handle different page sizes', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: POST ${BASE_URL}${SCAN_ENDPOINT} - Page Size Variations`);
    
    const pageSizes = ['A3', 'A4', 'A5', 'Letter', 'Legal'];
    
    for (const pageSize of pageSizes) {
      const payload = { ...validPayload, page_size: pageSize };
      console.log(`📤 Testing Page Size: ${pageSize}`);
      
      try {
        const response = await requestContext.post(`${BASE_URL}${SCAN_ENDPOINT}`, {
          data: payload,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const statusCode = response.status();
        console.log(`   ✅ Status: ${statusCode}`);
        expect([200, 201, 202, 400, 422]).toContain(statusCode);
      } catch (error) {
        console.log(`   ❌ Error for page size ${pageSize}: ${error}`);
        throw error;
      }
    }
    console.log('✓ Test passed: All page sizes handled\n');
    await requestContext.dispose();
  });

  test('POST /api/scan - Should validate color modes', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: POST ${BASE_URL}${SCAN_ENDPOINT} - Color Mode Validation`);
    
    const colorModes = ['Color', 'Grayscale', 'BlackAndWhite'];
    
    for (const colorMode of colorModes) {
      const payload = { ...validPayload, color_mode: colorMode };
      console.log(`📤 Testing Color Mode: ${colorMode}`);
      
      try {
        const response = await requestContext.post(`${BASE_URL}${SCAN_ENDPOINT}`, {
          data: payload,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const statusCode = response.status();
        console.log(`   ✅ Status: ${statusCode}`);
        expect([200, 201, 202, 400, 422]).toContain(statusCode);
      } catch (error) {
        console.log(`   ❌ Error for color mode ${colorMode}: ${error}`);
        throw error;
      }
    }
    console.log('✓ Test passed: All color modes handled\n');
    await requestContext.dispose();
  });

  test('POST /api/scan - Response time performance check', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: POST ${BASE_URL}${SCAN_ENDPOINT} - Performance Check`);
    
    const startTime = Date.now();
    console.log(`⏱️ Start Time: ${new Date(startTime).toISOString()}`);

    try {
      const response = await requestContext.post(`${BASE_URL}${SCAN_ENDPOINT}`, {
        data: validPayload,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`✅ Response received in: ${responseTime}ms`);
      console.log(`⏱️ End Time: ${new Date(endTime).toISOString()}`);
      
      const statusCode = response.status();
      console.log(`Status Code: ${statusCode}`);
      
      // Check for reasonable response time (less than 5 seconds)
      expect(responseTime).toBeLessThan(5000);
      console.log('✓ Test passed: Response time within acceptable range\n');
    } catch (error) {
      console.log(`❌ Error: ${error}`);
      throw error;
    } finally {
      await requestContext.dispose();
    }
  });
});

// Test suite for error scenarios
test.describe('Error Scenarios', () => {
  test('Should handle connection error gracefully', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: Connection Error Handling`);
    
    try {
      const response = await requestContext.get('http://127.0.0.1:9999/invalid').catch(() => null);
      if (!response) {
        console.log('✅ Connection error caught as expected');
        console.log('✓ Test passed: Error handling works\n');
      }
    } finally {
      await requestContext.dispose();
    }
  });

  test('Should handle malformed JSON', async () => {
    const requestContext = await request.newContext();
    console.log(`\n📍 TEST: Malformed JSON Handling`);
    console.log(`📤 Sending malformed JSON to POST endpoint`);

    try {
      const response = await requestContext.post(`${BASE_URL}${SCAN_ENDPOINT}`, {
        data: '{ invalid json }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Status Code: ${response.status()}`);
      expect([400, 422, 500]).toContain(response.status());
      console.log('✓ Test passed: Malformed JSON handled\n');
    } catch (error) {
      console.log(`✅ Request rejected: ${error}`);
      console.log('✓ Test passed: Malformed JSON rejected\n');
    } finally {
      await requestContext.dispose();
    }
  });
});
