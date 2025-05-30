package com.dnmanh.smartome.util.responsive;

import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import jakarta.servlet.http.HttpServletResponse;
import com.dnmanh.smartome.dto.response.RestResponse;
import com.dnmanh.smartome.util.annotation.ApiMessage;

@ControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response
    ) {

        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = servletResponse.getStatus();

        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatus(status);

        if (body instanceof String || body instanceof Resource) {
            return body;
        }

        String path = request.getURI().getPath();
        if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui")) {
            return body;
        }

        if (status >= 400) {
            // Khi status lỗi sẽ trả về dữ liệu phản hồi từ GlobalException hoặc Controller
            // code sau giúp phân biệt và xử lý 2 trường hợp đó
            // Nếu dữ liệu phản hồi từ GlobalException thì dữ liệu đó trước khi đến đây đã được xử lý đảm bảo cấu trúc theo RestResponse
            // Nếu dữ liệu phản hồi từ Controller thì dữ liệu đó có cấu trúc khác nên cần xử lý lại sao cho phù hợp với cấu trúc RestResponse
            if (body instanceof RestResponse<?>) {
                return body;
            } else {
                ApiMessage message = returnType.getMethodAnnotation(ApiMessage.class);
                res.setMessage(message != null ? message.value()[1] : "CALL API SUCCESS");
                return res;
            }

        } else {
            res.setData(body);
            ApiMessage message = returnType.getMethodAnnotation(ApiMessage.class);
            res.setMessage(message != null ? message.value()[0] : "CALL API SUCCESS");
        }

        return res;
    }

}
