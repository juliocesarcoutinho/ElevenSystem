package br.com.topone.elevenapi.projections;

public interface UserDetailsProjection {
    
    String getUsername();
    String getPassword();
    Long getRoleId();
    String getAuthority();
    boolean getActive();
    
}
