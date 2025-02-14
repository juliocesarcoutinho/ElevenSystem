package br.com.topone.elevenapi.records;

import java.time.Instant;

public record CustomErrorRecord(Instant timestamp, Integer status, String error, String path) {
}
