
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RegisterCredentials } from './types';

export const useAuthActions = (dispatch: React.Dispatch<any>) => {
  const { toast } = useToast();

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data?.user && data?.session) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: data.user, token: data.session.access_token },
        });
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [dispatch, toast]);

  const register = useCallback(async ({ email, password, name }: RegisterCredentials) => {
    dispatch({ type: 'REGISTER_START' });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
        toast({
          title: 'Registration Failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data?.user && data?.session) {
        // Also create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: name || email.split('@')[0],
            email,
            role: 'user',
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't fail registration if profile creation fails
        }

        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: { user: data.user, token: data.session.access_token },
        });

        toast({
          title: 'Registration Successful',
          description: 'Your account has been created successfully.',
        });
      }
    } catch (error: any) {
      dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [dispatch, toast]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [dispatch, toast]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: 'Reset Password Failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Reset Password Email Sent',
        description: 'Check your email for a reset password link.',
      });
    } catch (error: any) {
      toast({
        title: 'Reset Password Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast({
          title: 'Update Password Failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Password Updated',
        description: 'Your password has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Password Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updateProfile = useCallback(async (userData: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: userData,
      });

      if (error) {
        toast({
          title: 'Update Profile Failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Also update profile in DB if we have more data
      if (userData.name) {
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ name: userData.name })
            .eq('id', user.data.user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
        }
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Profile Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError,
  };
};
