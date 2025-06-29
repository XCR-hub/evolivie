<?php
/**
 * Proxy pour l'API Neoliane - Version 2.6 FINAL
 * À uploader sur evolivie.com/proxy-neoliane.php (remplacer l'ancien)
 * 
 * Utilise UNIQUEMENT l'endpoint d'authentification CORRECT selon la documentation
 */

// Configuration CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
header('Content-Type: application/json; charset=utf-8');

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration de l'API Neoliane selon la documentation officielle
define('NEOLIANE_API_BASE', 'https://api.neoliane.fr');
define('AUTH_ENDPOINT', '/nws/public/v1/auth/token'); // ✅ SEUL ENDPOINT CORRECT

// Vos clés API Neoliane (fournies par Neoliane)
define('CLIENT_ID', 'e543ff562ad33f763ad9220fe9110bf59c7ebd3736d618f1dc699632a86165eb');
define('CLIENT_SECRET', '4db90db4a8c18212469a925612ba497e033d83497620133c606e9fe777302f6b');

// Clé utilisateur intégrée
define('USER_KEY', '9162f8b63e4fc4778d0d5c66a6fd563bb87185ed2a02abd172fa586c8668f4b2');

// Fonction pour logger les erreurs
function logError($message, $data = null) {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] NEOLIANE PROXY v2.6: $message";
    if ($data) {
        $logMessage .= " - Data: " . json_encode($data, JSON_UNESCAPED_SLASHES);
    }
    error_log($logMessage);
}

// Fonction pour faire un appel HTTP
function makeHttpRequest($url, $method = 'GET', $data = null, $headers = []) {
    logError("Appel HTTP", ['url' => $url, 'method' => $method]);
    
    $ch = curl_init();
    
    // Configuration de base
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_USERAGENT => 'Neoliane-Proxy/2.6',
        CURLOPT_VERBOSE => false
    ]);
    
    // Headers par défaut
    $defaultHeaders = [
        'Content-Type: application/json',
        'Accept: application/json'
    ];
    
    // Fusionner avec les headers personnalisés
    $allHeaders = array_merge($defaultHeaders, $headers);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $allHeaders);
    
    // Configuration selon la méthode
    switch (strtoupper($method)) {
        case 'POST':
            curl_setopt($ch, CURLOPT_POST, true);
            if ($data) {
                $jsonData = is_string($data) ? $data : json_encode($data);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
                logError("POST Data", ['data' => $jsonData]);
            }
            break;
        case 'PUT':
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
            if ($data) {
                $jsonData = is_string($data) ? $data : json_encode($data);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
            }
            break;
        case 'DELETE':
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
            break;
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    logError("Réponse HTTP", [
        'http_code' => $httpCode,
        'response_length' => strlen($response),
        'curl_error' => $error,
        'response_preview' => substr($response, 0, 300)
    ]);
    
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Erreur cURL: $error");
    }
    
    return [
        'body' => $response,
        'http_code' => $httpCode
    ];
}

// Fonction d'authentification selon la documentation officielle
function authenticateWithNeoliane() {
    try {
        logError("Authentification Neoliane avec endpoint officiel UNIQUEMENT");
        
        $url = NEOLIANE_API_BASE . AUTH_ENDPOINT;
        
        // Données d'authentification EXACTES selon la documentation
        $authData = [
            'grant_type' => 'api_key',        // ✅ Valeur fixe obligatoire
            'client_id' => CLIENT_ID,         // ✅ Fourni par Neoliane
            'client_secret' => CLIENT_SECRET, // ✅ Fourni par Neoliane
            'user_key' => USER_KEY           // ✅ Clé intégrée
        ];
        
        logError("Données auth avec endpoint officiel", $authData);
        
        $result = makeHttpRequest($url, 'POST', $authData);
        
        if ($result['http_code'] === 200) {
            $authResponse = json_decode($result['body'], true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Réponse JSON invalide: " . json_last_error_msg());
            }
            
            logError("Réponse auth décodée", $authResponse);
            
            // Vérifier le format de réponse selon la documentation
            if (isset($authResponse['access_token'])) {
                logError("Authentification réussie", ['token_type' => $authResponse['token_type'] ?? 'unknown']);
                return [
                    'success' => true,
                    'access_token' => $authResponse['access_token'],
                    'expires_in' => $authResponse['expires_in'],
                    'token_type' => $authResponse['token_type'] ?? 'Bearer'
                ];
            } else {
                throw new Exception("Format de réponse inattendu - access_token manquant");
            }
        } else {
            // Analyser l'erreur
            $errorResponse = json_decode($result['body'], true);
            $errorMsg = 'Erreur HTTP ' . $result['http_code'];
            
            if ($errorResponse) {
                if (isset($errorResponse['error'])) {
                    $errorValue = $errorResponse['error'];
                    $errorMsg = is_array($errorValue) || is_object($errorValue) ? json_encode($errorValue) : $errorValue;
                } elseif (isset($errorResponse['message'])) {
                    $messageValue = $errorResponse['message'];
                    $errorMsg = is_array($messageValue) || is_object($messageValue) ? json_encode($messageValue) : $messageValue;
                }
            } else {
                $errorMsg .= ' - ' . substr($result['body'], 0, 200);
            }
            
            logError("Erreur authentification", [
                'http_code' => $result['http_code'],
                'error_msg' => $errorMsg,
                'response_body' => $result['body']
            ]);
            
            throw new Exception("Erreur d'authentification: $errorMsg");
        }
        
    } catch (Exception $e) {
        logError("Erreur authentification générale", ['error' => $e->getMessage()]);
        throw $e;
    }
}

// Fonction pour faire un appel API
function makeApiCall($endpoint, $method, $accessToken, $data = null) {
    try {
        $url = NEOLIANE_API_BASE . $endpoint;
        
        $headers = [
            "Authorization: Bearer $accessToken"
        ];
        
        logError("Appel API", [
            'endpoint' => $endpoint,
            'method' => $method,
            'has_data' => !is_null($data)
        ]);
        
        $result = makeHttpRequest($url, $method, $data, $headers);
        
        logError("Réponse API", [
            'endpoint' => $endpoint,
            'http_code' => $result['http_code'],
            'response_preview' => substr($result['body'], 0, 200)
        ]);
        
        if ($result['http_code'] >= 200 && $result['http_code'] < 300) {
            $apiResponse = json_decode($result['body'], true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Réponse JSON invalide de l'API: " . json_last_error_msg());
            }
            
            return [
                'success' => true,
                'data' => $apiResponse
            ];
        } else {
            $errorResponse = json_decode($result['body'], true);
            $errorMsg = 'Erreur HTTP ' . $result['http_code'];
            
            if ($errorResponse) {
                if (isset($errorResponse['error'])) {
                    $errorValue = $errorResponse['error'];
                    $errorMsg = is_array($errorValue) || is_object($errorValue) ? json_encode($errorValue) : $errorValue;
                } elseif (isset($errorResponse['message'])) {
                    $messageValue = $errorResponse['message'];
                    $errorMsg = is_array($messageValue) || is_object($messageValue) ? json_encode($messageValue) : $messageValue;
                }
            } else {
                $errorMsg .= ' - ' . substr($result['body'], 0, 200);
            }
            
            throw new Exception("Erreur API: $errorMsg");
        }
        
    } catch (Exception $e) {
        logError("Erreur appel API", [
            'endpoint' => $endpoint,
            'error' => $e->getMessage()
        ]);
        throw $e;
    }
}

// Fonction pour télécharger des documents
function downloadDocuments($subscriptionId, $accessToken) {
    try {
        $url = NEOLIANE_API_BASE . "/nws/public/v1/api/subscription/$subscriptionId/documents";
        
        $headers = [
            "Authorization: Bearer $accessToken"
        ];
        
        $result = makeHttpRequest($url, 'GET', null, $headers);
        
        if ($result['http_code'] === 200) {
            // Retourner directement le contenu binaire pour les documents
            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment; filename="documents-neoliane-' . $subscriptionId . '.pdf"');
            echo $result['body'];
            exit();
        } else {
            throw new Exception("Erreur lors du téléchargement: HTTP {$result['http_code']}");
        }
        
    } catch (Exception $e) {
        logError("Erreur téléchargement documents", [
            'subscription_id' => $subscriptionId,
            'error' => $e->getMessage()
        ]);
        throw $e;
    }
}

// Traitement principal
try {
    logError("Nouvelle requête v2.6", [
        'method' => $_SERVER['REQUEST_METHOD'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ]);
    
    // Vérifier la méthode HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Seules les requêtes POST sont autorisées');
    }
    
    // Lire les données JSON
    $input = file_get_contents('php://input');
    logError("Input reçu", ['input_length' => strlen($input), 'input_preview' => substr($input, 0, 300)]);
    
    $requestData = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Données JSON invalides: ' . json_last_error_msg());
    }
    
    if (!isset($requestData['action'])) {
        throw new Exception('Action manquante dans la requête');
    }
    
    $action = $requestData['action'];
    
    logError("Action demandée", ['action' => $action]);
    
    switch ($action) {
        case 'test':
            // Test de disponibilité du proxy
            logError("Test de disponibilité v2.6");
            echo json_encode([
                'success' => true,
                'message' => 'Proxy Neoliane opérationnel',
                'version' => '2.6',
                'timestamp' => date('Y-m-d H:i:s'),
                'api_base' => NEOLIANE_API_BASE,
                'auth_endpoint' => AUTH_ENDPOINT,
                'client_id_configured' => !empty(CLIENT_ID),
                'client_secret_configured' => !empty(CLIENT_SECRET),
                'user_key_integrated' => !empty(USER_KEY),
                'endpoint_fixed' => true
            ]);
            break;
            
        case 'auth':
            // Authentification (ignore user_key car elle est intégrée)
            $authResult = authenticateWithNeoliane();
            echo json_encode($authResult);
            break;
            
        case 'api_call':
            // Appel API
            if (!isset($requestData['endpoint']) || !isset($requestData['access_token'])) {
                throw new Exception('endpoint ou access_token manquant');
            }
            
            $endpoint = $requestData['endpoint'];
            $method = $requestData['method'] ?? 'GET';
            $accessToken = $requestData['access_token'];
            $data = $requestData['data'] ?? null;
            
            $apiResult = makeApiCall($endpoint, $method, $accessToken, $data);
            echo json_encode($apiResult);
            break;
            
        case 'download_documents':
            // Téléchargement de documents
            if (!isset($requestData['subscription_id']) || !isset($requestData['access_token'])) {
                throw new Exception('subscription_id ou access_token manquant');
            }
            
            downloadDocuments($requestData['subscription_id'], $requestData['access_token']);
            break;
            
        default:
            throw new Exception("Action non supportée: $action");
    }
    
} catch (Exception $e) {
    logError("Erreur générale v2.6", ['error' => $e->getMessage()]);
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s'),
        'version' => '2.6'
    ]);
}
?>