  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignUp && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isSignUp) {
        // 1) إنشاء الحساب ببيانات المستخدم الحقيقية
        await postJSON("/auth/student/signup", {
          full_name: form.fullName,
          name: form.fullName,
          email: form.email,
          password: form.password,
        });
        // 2) الباك ما بيرجّع توكن عند التسجيل، فنسجّل دخول مباشرة
        data = await postJSON("/auth/student/login", {
          email: form.email,
          password: form.password,
        });
      } else {
        data = await postJSON("/auth/student/login", {
          email: form.email,
          password: form.password,
        });
      }

      if (data.access_token) {
        saveToken(data.access_token, isSignUp ? true : remember);
        navigate("/onboarding");
      } else {
        setError("Login successful but no token received");
      }
    } catch (err) {
      setError(err.message || "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };
