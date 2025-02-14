package br.com.topone.elevenapi.service.exceptions;

@SuppressWarnings("serial")
public class EmailException extends RuntimeException {

	public EmailException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
