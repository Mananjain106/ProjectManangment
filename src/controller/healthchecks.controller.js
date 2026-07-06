import ApiResponse from "../utils/api-response.js";

const healthCheck = (req, res) => {
             try {
                res.status(200).json(new ApiResponse(200, "Health check successful", null));
             } catch (error) {
                
             }


}
export  {healthCheck};  